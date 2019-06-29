
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
const request = require('request')
const API_KEY = require('../../config/keys').mongoURI;

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
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          diagCentreName:diagnostics.centreName,
          centreShortCode: diagnostics.short,
          centreCode: diagnostics.centreCode

        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              diagnostics.members.unshift({id:user.emailId})
              diagnostics.save().then(diag => {
                console.log(diag)
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
      // User.findOne({emailId: req.user.emailId}).then(admin => {, admin: admin
      Patient.find({diagCentre:diagnostics.orgEmail}).then(patients => {
        Patient.find({uploadedBy: req.user.emailId}).then(pat => {
          res.json({
            details: diagnostics, users: users, totalUploads: patients.length, myUploads: pat.length
          })
        })

      })
    })
  }).catch(err => {
    res.status(404).json('Please try again later, there seems to be a problem on our side')
  })
});

router.post('/patientDetails',passport.authenticate('all_diag',{session: false}), (req, res) => {
  const { errors, isValid } = uploadFilesInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  console.log('here')
  console.log(req.body.patient, req.body.centre)
  // request.get({api:API_KEY, qs: req.body},(err, res, body) => {
  //   if(body.status==='FAIL') {
  //     console.log("here")
  //     return res.json({patient: null,invalid: true})
  //   }
  //   res.json({patient: body.patient_details,invalid: false})
  //
  // })
  db.Patient.findOne({where:{mrNo:req.body.patient, centreCode:req.body.centre}}).then(patient => {
    if(patient===null) {
          console.log("here")
          return res.json({patient: null,invalid: true})
    }
    console.log({all:patient})
    res.json({patient: patient,invalid: false})
  })
    .catch(err => {
    res.status(400).json({inValid: 'Some thing is wrong try later'})
  })
})

router.post('/continueToUpload',passport.authenticate('all_diag', {session: false}),(req, res) => {
  console.log(req.user.id)
  User.findById(req.user.id).then(user => {
    db.Patient.findOne({where:{mrNo:req.body.patient, centreCode:req.body.centre}}).then(patient => {
      console.log({sqlPat:patient, dob: patient.dob})
      let today = new Date();
      let birthDate = new Date(patient.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      console.log(birthDate, age)
      const newUpload = new Patient({
        mrNo: req.body.patient,
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: age,
        gender: patient.gender,
        uploadedBy: user.emailId,
        diagCentreName: user.diagCentreName,
        diagCentre: user.diagCentre,
        centreShortCode: user.centreShortCode,
        centreCode: user.centreCode
      })
      newUpload.save().then(pat => {
        console.log({ "created user": pat._id })
        res.json({ mid: pat._id })
      }).catch(err => {
        console.log(err)
      })
    })
  })
})

//TODO uncomment this and remove above
// router.post('/continueToUpload',passport.authenticate('all_diag', {session: false}),(req, res) => {
//   console.log(req.user.id)
//   User.findById(req.user.id).then(user => {
//     // db.Patient.findOne({where:{mrNo:req.body.patient, centreCode:req.body.centre}}).then(patient => {
//     request.get({ api: API_KEY, qs: req.body }, (err, res, body) => {
//       if (body.status === 'FAIL') {
//         console.log(err)
//       } else {
//         console.log({ sqlPat: body.patient_details, dob: body.patient_details.dob })
//         let today = new Date();
//         let birthDate = new Date(body.patient_details.dob);
//         let age = today.getFullYear() - birthDate.getFullYear();
//         let m = today.getMonth() - birthDate.getMonth();
//         if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//           age--;
//         }
//         console.log(birthDate, age)
//         const newUpload = new Patient({
//           mrNo: req.body.patient,
//           firstName: body.patient_details.first_name,
//           lastName: body.patient_details.last_name,
//           age: age,
//           gender: body.patient_details.gender,
//           uploadedBy: user.emailId,
//           diagCentreName: user.diagCentreName,
//           diagCentre: user.diagCentre,
//           centreShortCode: user.centreShortCode,
//           centreCode: user.centreCode
//         })
//         newUpload.save().then(pat => {
//           console.log({ "created user": pat._id })
//           res.json({ mid: pat._id })
//         }).catch(err => {
//           console.log(err)
//         })
//       }
//     })
//   })
// })
router.post('/onDiscard',passport.authenticate('all_diag',{session: false}),(req, res) => {
  Patient.deleteOne({_id: req.body.mid}).then(patient => {
    console.log({'Deleted User':req.body.mid});
  }).catch(err => {
    console.log('There is an error please bear with us')
  })
})

// router.post('/deleteMember',passport.authenticate('diag_admin', { session: false }), (req, res) => {
//   User.deleteOne({_id:req.body.id}).then(user => {
//     console.log('In remove')
//     Diagnostics.findOne({adminId:req.user.emailId}).then(diagnostics => {
//       diagnostics.members=diagnostics.members.filter(element => {element.id !== req.params.id})
//       diagnostics.save().then(diag => {
//         res.json({success: true})
//       })
//     })
//   }).catch(err => {
//     console.log({error: err})
//   })
router.post('/removeUserAccess',passport.authenticate('diag_admin', {session: false}),
  (req, res) => {
    User.findOneAndUpdate({emailId: req.body.emailId},{access: false}).then(user => {
      res.json({success: true})
    }).catch(err => {
      console.log({error: err})
    })
  })

router.post('/grantUserAccess',passport.authenticate('diag_admin', {session: false}),
  (req, res) => {
    User.findOneAndUpdate({emailId: req.body.emailId},{access: true}).then(user => {
      res.json({success: true})
    }).catch(err => {
      console.log({error: err})
    })
  })

router.get('/currentDiagUsers', passport.authenticate('diag_admin', { session: false }), (req, res) => {
  User.find({role: 'diag',access: true, admin: req.user.emailId}).then(users => {
    res.json(users)
  })
});

router.get('/deAssignedDiagUsers', passport.authenticate('diag_admin', { session: false }), (req, res) => {
  User.find({role: 'lvpei',access: false, admin: req.user.emailId}).then(users => {
    res.json(users)
  })
});


module.exports = router