const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateRegisterInput = require('../../validations/register')
const validateLoginInput = require('../../validations/login')
const User = require('../../models/User');
const Patient = require('../../models/Patient');

const validateName = require('../../validations/name')

//@desc Register
// router.post('/register', (req, res) => {
//   const { errors, isValid } = validateRegisterInput(req.body)
//
//   if (!isValid) {
//     return res.status(400).json(errors)
//   }
//   User.findOne({ emailId: req.body.emailId }).then(user => {
//     if (user) {
//       errors.emailId = 'Account already exists please use your password to login'
//       return res.status(400).json(errors)
//     } else {
//       const newUser = new User({
//         emailId: req.body.emailId,
//         password: req.body.password,
//         role: req.body.role
//       })
//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err
//           newUser.password = hash
//           newUser
//             .save()
//             .then(user => {
//               const payload = { id: user.id, avatar: user.avatar ,role: user.role}
//               //TODO change secret key and signIn options
//               jwt.sign(payload, keys.secretOrKey, { expiresIn: '12h' },
//                 (err, token) => {
//                   res.json({
//                     user,
//                     success: true,
//                     token: 'Bearer ' + token
//                   })
//                 })
//             })
//             .catch(err => console.log(err))
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
        const payload = { id: user.id,role: user.role}
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
// //Logged In Session currentUser
// router.get('/myAccount', passport.authenticate('all', { session: false }),
//   (req, res) => {
//     let activity = {};
//     const userId=req.user._id;
//     Question.find({ user: userId }, { 'title': 1, 'tags': 1, 'description': 1, 'time': 1, '_id': 0 })
//       .then(questions => {
//         if (!questions) {
//         } else {
//           activity.questions = questions;
//           Question.find({ 'comments.user': userId }, {
//             'title': 1,
//             'tags': 1,
//             'comments.text': 1,
//             'comments.time': 1,
//             'time': 1,
//             '_id': 0
//           }).then(comments => {
//             if (!comments) {
//             } else {
//               activity.comments = comments;
//               Question.find({ 'answer.user': userId }, {
//                 'title': 1,
//                 'tags': 1,
//                 'time': 1,
//                 '_id': 0,
//                 'answer.text': 1,
//                 'answer.time': 1
//               }).then(answers => {
//                 if (!answers) {
//                 } else {
//                     activity.answers = answers;
//                   res.json({
//                     firstName: req.user.firstName,
//                     lastName: req.user.lastName,
//                     email: req.user.emailId,
//                     departmentName: req.user.departmentName,
//                     githubUsername: req.user.githubUsername,
//                     avatar: req.user.avatar,
//                     linkedIn: req.user.linkedIn,
//                     codeForces: req.user.codeForces,
//                     questionsAsked: activity.questions,
//                     questionsAnswered: activity.answers,
//                     questionsCommented: activity.comments
//                   })
//                 }
//               }).catch(err => {
//                 return res.status(404).json({ err })
//               })
//             }
//           }).catch(err => {
//             return res.status(404).json({ err })
//           })
//         }
//       }).catch(err => {
//       return res.status(404).json({ err })
//     })
//
//
//
//
//   })
//
// //Change Password
// router.post('/changePassword', passport.authenticate('all', { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validatePassword(req.body)
//     if (!isValid) {
//       res.status(404).json(errors)
//     }
//     const password = req.body.password
//     let newPassword = req.body.newPassword
//     bcrypt.compare(password, req.user.password).then(isMatch => {
//       if (isMatch) {
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newPassword, salt, (err, hash) => {
//             if (err) throw err
//             newPassword = hash
//             User.findOneAndUpdate({_id: req.user._id}, { password: newPassword }, (err, res) => {
//               if (err) throw err
//             }).then(user => {
//               res.json({ success: 'password is changed successfully' })
//             }).catch(err => {
//               return res.status(404).json({ failed: 'Your password is not updated', err })
//             })
//           })
//         })
//       } else {
//         errors.password = 'Incorrect Password'
//         return res.status(400).json(errors.password)
//       }
//     })
//   })
//
// //Update Profile CodeForces, Github, linkedIn
// router.post('/myAccount/change', passport.authenticate('all', { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validateProfileInput(req.body);
//     console.log({body: req.body})
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }
//     const profileFields = {};
//     if (req.body.githubUsername) {
//       profileFields.githubUsername = req.body.githubUsername;
//     }
//     // TODO Skills
//     // if (typeof req.body.skills !== 'undefined') {
//     //   profileFields.skills = req.body.skills.split(',');
//     // }
//     if (req.body.codeForces) {
//       profileFields.codeForces = req.body.codeForces;
//     }
//     if (req.body.linkedIn) profileFields.linkedIn = req.body.linkedIn;
//       User.findOneAndUpdate(
//         { _id: req.user._id },
//         { $set: profileFields },
//         {new: true}
//       ).then(user => {
//           res.json(user)
//       });
//   }
// );
// //Apply For TA position
// router.post('/applyForTA',passport.authenticate('student',{session:false}),
//   (req,res) => {
//     const { errors, isValid } = validateApplication(req.body);
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }
//     User.findByIdAndUpdate(req.user._id,{applyTA: true,taCourse: req.body.courseCode}).then(user => {
//       console.log(user);
//       res.json(user)
//     }).catch(err => res.status(400).json('There was error in submitting the application'))
//   })
// router.get('/getAllCourses',passport.authenticate('all',{session: false}),(req,res) => {
//   let courses=[];
//   Department.find().then(departments => {
//     departments.forEach(department => {
//       department.courses.forEach(course => {
//         courses.push(course.courseCode.trim());
//       })
//     })
//     res.json({allCourses: courses})
//   }).catch(err => res.status(404).json({NoDepFound: 'no department found'})
//   )
// })
//

module.exports = router