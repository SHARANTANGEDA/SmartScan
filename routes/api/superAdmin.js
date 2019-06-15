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
      newCentre.save().then(diagnostics=> {

        User.findOne({ emailId: req.body.adminId }).then(user => {
          if (user) {
            errors.adminId = 'Account already exists please create with different name'
            return res.status(400).json(errors)
          } else {
              const newUser = new User({
                emailId: req.body.adminId,
                password: req.body.password,
                diagCentre: diagnostics.orgEmail, //to change
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
          }
        })
      }).catch(err => {
        return res.status(400).json('Please try again')
      })

    }
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
      dummy.push(new Promise((resolve, reject) => {
        centre.push({user:user,emp: diag.filter(diag => {diag.admin === user._id})})
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