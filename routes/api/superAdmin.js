const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateRegisterInput = require('../../validations/register')
const validateDiagnosticsInput = require('../../validations/newDiagnostics')
const User = require('../../mongoModels/User')
const Diagnostics=require('../../mongoModels/Diagnostics')

// router.post('/registerSA',(req, res) => {
//   // const { errors, isValid } = validateRegisterInput(req.body)
//   // if (!isValid) {
//   //   return res.status(400).json(errors)
//   // }
//   User.findOne({ emailId: req.body.emailId }).then(user => {
//
//     if (user) {
//       return res.status(400).json('errors')
//     } else {
//       const newUser = new User({
//         emailId: req.body.emailId,
//         password: req.body.password,
//         role: 'super_admin'
//       })
//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err
//           newUser.password = hash
//           newUser.save().then(user => {
//             res.json({success: true,user})
//           }).catch(err => {
//             console.log(err)
//             res.json({error: 'creating the user'})
//           })
//         })
//       })
//     }
//   })
// })
router.post('/register', passport.authenticate('super_admin',{session: false}),(req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({ emailId: req.body.emailId }).then(user => {
    if (user) {
      errors.emailId = 'Account already exists please create with different name'
      return res.status(400).json(errors)
    } else {
      const newUser = new User({
        emailId: req.body.emailId,
        password: req.body.password,
        role: 'lvpei'
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().then(res => {
            res.json({success: true})
          }).catch(err => {
            console.log(err)
            res.json({error: 'creating the user'})
          })
        })
      })
    }
  })
})

router.post('/addDiagnostic',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
  const { errors, isValid } = validateDiagnosticsInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  Diagnostics.findOne({orgEmail: req.body.orgEmail}).then(diagnostics => {
    if(diagnostics) {
      errors.orgEmail='This organization is already added to the system,' +
        ' you can control their access on dashboard';
      return res.status(400).json(errors);
    } else {
      const newCentre = new Diagnostics({
        orgEmail: req.body.orgEmail,
        centreName: req.body.centreName,
        adminId: req.body.adminId
      })
      // newCentre.save().then(diagnostics=> {
        User.findOne({ emailId: req.body.adminId }).then(user => {
          if (user) {
            errors.adminId = 'Account already exists please create with different name'
            return res.status(400).json(errors)
          } else {
            newCentre.save().then(diagnostics=> {
              const newUser = new User({
                emailId: req.body.adminId,
                password: req.body.password,
                diagCentre: req.body.orgEmail, //to change
                diagCentreName: req.body.centreName,
                role: 'diag_admin'
              })
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err
                  newUser.password = hash
                  newUser.save().then(user => {
                    console.log({diag: diagnostics, user: user})
                    res.json({ success: true })
                  }).catch(err => {
                    console.log(err)
                    res.json({ error: 'creating the user' })
                  })
                })
              })
            }).catch(err => {
              return res.status(400).json('Please try again')
            })
          }
        })
    }
  })

})

router.post('/removeAccess',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
  console.log(Date.now())
  Diagnostics.findOneAndUpdate({adminId: req.body.emailId},{access: false, lastUpdate: Date.now()}).
  then(diagnostics => {
    User.findOneAndUpdate({emailId: req.body.emailId},{access: false}).then(admin => {
      User.find({admin: req.body.emailId}).then(users => {
        users.map(user => {
          User.findByIdAndUpdate(user._id,{access: false}).then(newUser => {
            console.log(user)
          }).catch(err => {
            console.log('Error in removing')
          })
        })
        res.json({success: true})
      })
    })
  })
})

router.post('/grantAccess',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
    Diagnostics.findOneAndUpdate({adminId: req.body.emailId},{access: true, lastUpdate: Date.now()}).
    then(diagnostics => {
      User.findOneAndUpdate({emailId: req.body.emailId},{access: true}).then(admin => {
        User.find({admin: req.body.emailId}).then(users => {
          users.map(user => {
            User.findByIdAndUpdate(user._id,{access: true}).then(newUser => {
              console.log(user)
            }).catch(err => {
              console.log('Error in adding')
            })
          })
          res.json({success: true})
        })
      })
    })
  })


router.post('/deleteLVPEIUser',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
  User.deleteOne({emailId: req.body.emailId, role:'lvpei'}).then(data => {
    res.json({success: true})
  }).catch(err => {
    res.json({success: false})
  })
})

router.get('/activeCentres',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
  Diagnostics.find({access: true}).then(diagnostics => {
    res.json(diagnostics)
  }).catch(err => {
    console.log(err,'IN ACTIVE')
    res.json({fail: true})
  })
})

router.get('/inactiveDiags',passport.authenticate('super_admin', {session: false}),
  (req, res) => {
  console.log('here')
    Diagnostics.find({access: false}).then(diagnostics => {
      console.log('IN INACTIVE SUCCESS')
      res.json(diagnostics)
    }).catch(err => {
      console.log(err,'IN IN-ACTIVE')

      res.json({fail: true})
    })
  })
router.get('/home', passport.authenticate('super_admin', { session: false }), (req, res) => {
  User.find().then(async users => {
    let lvpei = [], diag_admin = [], dummy = [], diag = [], centre = []
    users.map(user => {
      dummy.push(new Promise((resolve, reject) => {
        if (user.role === 'lvpei') {
          lvpei.push(user)
        } else if (user.role === 'diag_admin') {
          diag_admin.push(user)
        } else if (user.role === 'diag') {
          diag.push(user)
        }
      }))
    })
    diag_admin.map(user => {
      centre.push(new Promise((resolve, reject) => {
        User.find({admin: user.emailId}).then(users => {
          resolve({user:user,emp: users.length})
        })
      }))
    })
    res.json({
      lvpei: await Promise.all(lvpei),
      diag_admin: await Promise.all(diag_admin),
      centre: await Promise.all(centre),
      diagLen: diag.length
    })
  })
});


module.exports = router