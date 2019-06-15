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
const User = require('../../mongoModels/User')

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
        role: req.body.role
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