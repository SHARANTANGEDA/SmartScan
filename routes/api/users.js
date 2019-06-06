const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateRegisterInput = require('../../validations/register')
const validatePassword = require('../../validations/ChangePassword')
const validateLoginInput = require('../../validations/login')
const User = require('../../models/User');
const Patient = require('../../models/Patient');

const validateName = require('../../validations/name')

// @desc Register
router.post('/register', passport.authenticate('lvpei',{session: false}),(req, res) => {
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
        role: 'MRI'
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

//
// router.post('/registerLVP',(req, res) => {
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
//         role: 'lvpei'
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
        const payload = { id: user.id,role: user.role, emailId: user.emailId}
        //TODO change secret key and signIn options
        jwt.sign(payload, keys.secretOrKey, { expiresIn: '12h' },
          (err, token) => {
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

//@Get Name of patient
router.post('/enterName',passport.authenticate('MRI',{session: false}),
  (req,res) => {
  console.log(req.body)
    const {errors , isValid} =validateName(req.body);
    if(!isValid) {
      return res.status(400).json(errors);
    }

    const newPatient = new Patient({
      name: req.body.name,
      empty: true
    });
    console.log("Name is being saved")
    newPatient.save().then(patient => {
      console.log(patient)
      res.json(patient)
    }).catch(err => {
      console.log(err)
      res.json(errors)
    });
});

//Change Password
router.post('/changePassword', passport.authenticate('all', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePassword(req.body)
    if (!isValid) {
      res.status(404).json(errors)
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
        return res.status(400).json(errors.password)
      }
    })
  })

module.exports = router