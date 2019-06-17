const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validatePassword = require('../../validations/ChangePassword')
const validateLoginInput = require('../../validations/login')
const validateSearchInput = require('../../validations/search')
const User = require('../../mongoModels/User');
const Patient = require('../../mongoModels/Patient');


//@desc Login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const emailId = req.body.emailId
  const password = req.body.password

  User.findOne({ emailId }).then(user => {

    if (!user) {
      errors.emailId = 'User not Found'
      return res.status(400).json(errors)
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        let payload
        if(user.role ==='super_admin') {
          payload = { id: user.id,role: user.role, emailId: user.emailId}
        }else if(user.role === 'diag_admin') {
          payload = { id: user.id,role: user.role, emailId: user.emailId, diagId: user.diagCentre}
        } else if(user.role === 'diag') {
          payload = { id: user.id,role: user.role, emailId: user.emailId, diagId: user.diagCentre}
        }else if(user.role === 'lvpei') {
          payload = { id: user.id,role: user.role, emailId: user.emailId}
        }
        //TODO change secret key and signIn options
        jwt.sign(payload, keys.secretOrKey, { expiresIn: '12h' },
          (err, token) => {
          console.log(payload)
            res.json({
              success: true,
              token: 'Bearer ' + token
            })
          })
      } else {
        errors.password = 'Incorrect Password'
        return res.status(400).json(errors)
      }
    })
  })
})

// //@Get Name of patient
// router.post('/enterName',passport.authenticate('MRI',{session: false}),
//   (req,res) => {
//   console.log(req.body)
//     const {errors , isValid} =validateName(req.body);
//     if(!isValid) {
//       return res.status(400).json(errors);
//     }
//
//     const newPatient = new Patient({
//       name: req.body.name,
//       empty: true
//     });
//     console.log("Name is being saved")
//     newPatient.save().then(patient => {
//       console.log(patient)
//       res.json(patient)
//     }).catch(err => {
//       console.log(err)
//       res.json(errors)
//     });
// });

//Change Password
router.post('/changePassword', passport.authenticate('all', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePassword(req.body)
    if (!isValid) {
      return res.status(404).json(errors)
    }
    const password = req.body.password
    let newPassword = req.body.newPassword
    bcrypt.compare(password, req.user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err
            newPassword = hash
            User.findOneAndUpdate({_id: req.user._id}, { password: newPassword }, (err, res) => {
              if (err) throw err
            }).then(user => {
              res.json({ success: 'password is changed successfully' })
            }).catch(err => {
              return res.status(404).json({ failed: 'Your password is not updated', err })
            })
          })
        })
      } else {
        errors.password = 'Incorrect Password'
        return res.status(400).json(errors)
      }
    })
  })

router.post('/search',passport.authenticate('lvpei',{session: false}),(req, res) => {
  const { errors, isValid } = validateSearchInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  if(req.body.category === 'mr.No') {
    Patient.find({mrNo: req.body.search}).then( patients =>
    {
      if(patients.length === 0) {
        return res.json({success: false})
      }
      res.json({mrNo: req.body.search, success: true})
    }).catch(err => {
      res.json({success: false})
    })
  }
})

//
// router.post('/masterBackDoor',
//   (req, res) => {
//     let newPassword = req.body.newPassword
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newPassword, salt, (err, hash) => {
//             if (err) throw err
//             newPassword = hash
//             res.json(newPassword)
//           })
//         })
//     })


module.exports = router