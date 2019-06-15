const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateRegisterInput = require('../../validations/register')
const validateDiagnosticsInput = require('../../validations/newDiagnostics')
const User = require('../../mongoModels/User')
const Diagnostics=require('../../mongoModels/Diagnostics')
const Patient = require('../../mongoModels/Patient')
const uploadFilesInput = require('../../validations/uploadFiles')
const db = require('../../models')

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
router.post('/addMembers', passport.authenticate('diag_admin',{session: false}),(req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  Diagnostics.findOne({adminId: req.user.emailId}).then(diagnostics => {
    User.findOne({ emailId: req.body.emailId }).then(user => {
      if (user) {
        errors.emailId = 'Account already exists please create with different name'
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          emailId: req.body.emailId,
          password: req.body.password,
          role: 'diag',
          admin: req.user.emailId,
          diagCentre: diagnostics.orgEmail,
          diagCentreName:diagnostics.centreName
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              diagnostics.members.unshift({id:user.emailId})
              diagnostics.save().then(diag => {
                res.json({success: true})
              })
            }).catch(err => {
              res.json({error: 'Error creating the user'})
            })
          })
        })
      }
    })
  })
})


router.get('/home', passport.authenticate('diag_admin', { session: false }), (req, res) => {

  Diagnostics.findOne({adminId: req.user.emailId}).then(diagnostics => {
    User.find({diagCentre: diagnostics.orgEmail, role:'diag'}).then(users => {
      res.json({
        details: diagnostics, users: users
      })
    })
    //   .catch(err => {
    //   res.status(404).json('Please try again later, there seems to be a problem on our side')
    // })
  }).catch(err => {
    res.status(404).json('Please try again later, there seems to be a problem on our side')
  })
});

router.post('/patientDetails',passport.authenticate('diag_admin',{session: false}), (req, res) => {
  const { errors, isValid } = uploadFilesInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  db.Patient.findByPk(req.body.patient).then(patient => {
    if(patient===null) {
      return res.json({patient: patient,invalid: true})
    }
    Patient.find({transit: true}).then()
    res.json({patient: patient,invalid: false})
  }).catch(err => {
    res.status(400).json({inValid: 'Some thing is wrong try later'})
  })
})

router.get('/deleteMember/:id',passport.authenticate('diag_admin', { session: false }), (req, res) => {
  User.remove({_id:req.params.id}).then(user => {
    Diagnostics.findOne({adminId:req.user.emailId}).then(diagnostics => {
      diagnostics.members=diagnostics.members.filter(element => {element.id !== req.params.id})
      diagnostics.save().then(diag => {
        res.json({success: true})
      })
    })
  }).catch(err => {
    console.log({error: err})
  })
})


module.exports = router