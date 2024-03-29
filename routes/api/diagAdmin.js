const LVPEI_API_KEY = require('../../config/keys').LVPEI_API_KEY
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateRegisterInput = require('../../validations/register')
const User = require('../../mongoModels/User')
const Diagnostics=require('../../mongoModels/Diagnostics')
const Patient = require('../../mongoModels/Patient')
const uploadFilesInput = require('../../validations/uploadFiles')
const request = require('request-promise')
// const request = require('request')
const API_KEY = require('../../config/keys').mongoURI;
const axios = require('axios')
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
  // request(API_KEY,{method: 'POST', body: {mrno:req.body.patient, center_code: req.body.centre},json: true},(err, res, body) =>{
  //   if(err) {
  //     console.log(err)
  //     res.status(400).json({inValid: 'Some thing is wrong try later'},err)
  //
  //   }
  //   if(body.status==='FAIL') {
  //     console.log("here")
  //     return res.json({patient: null,invalid: true})
  //   }
  //   res.json({patient: body.patient_details,invalid: false, centreCode:req.body.centre})
  //
  // })
  request({method: 'POST',uri:LVPEI_API_KEY, form: {mrno:req.body.patient, center_code: req.body.centre},json: true,
  headers: {
  }}).then(details => {
    if(details.status==='FAIL') {
      return res.json({patient: null,invalid: true})
    }
    res.json({patient: details.patient_details,invalid: false, centreCode:req.body.centre})
  }).catch(err => {
      res.status(400).json({inValid: 'Some thing is wrong try later',err})
  })
//   axios.post(LVPEI_API_KEY, {
//     mrno:req.body.patient, center_code: req.body.centre
//   }).then(details => {
//     console.log({DETAILS:details})
//   }).catch(err => {
//  console.log(err)
// res.status(400).json({inValid: 'Some thing is wrong try later',err})
// })
  // axios({
  //   method: 'POST',
  //   url: LVPEI_API_KEY,
  //   headers: {
  //     "Access-Control-Allow-Origin": "*"
  //   },
  //   data:JSON.stringify({ mrno:req.body.patient, center_code: req.body.centre }),
  //   validateStatus: (status) => {
  //     return true; // I'm always returning true, you may want to do it depending on the status received
  //   },
  // }).then(details => {
  //
  //   console.log({DETAILS:details})
  // }).catch(err => {
  //   console.log(err.message)
  //   res.status(400).json({inValid: 'Some thing is wrong try later',err})
  // })
  // request.get({api:API_KEY, qs: {mrno:req.body.patient, center_code: req.body.centre}},(err, res, body) => {
  //   if(body.status==='FAIL') {
  //     console.log("here")
  //     return res.json({patient: null,invalid: true})
  //   }
  //   res.json({patient: body.patient_details,invalid: false, centreCode:req.body.centre})
  //
  // }).catch(err => {
  //   res.status(400).json({inValid: 'Some thing is wrong try later'})
  // })
})


router.post('/continueToUpload',passport.authenticate('all_diag', {session: false}),(req, res) => {
  User.findById(req.user.id).then(user => {
    // db.Patient.findOne({where:{mrNo:req.body.patient, centreCode:req.body.centre}}).then(patient => {
    request({method: 'POST',uri:LVPEI_API_KEY, form: {mrno:req.body.patient, center_code: req.body.centre},json: true,
      headers: {
      }}).then(details => {

      if(details.status==='FAIL') {
        return res.json({patient: null,invalid: true})
      }else {
        let today = new Date();
        let birthDate = new Date(details.patient_details.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        const newUpload = new Patient({
          mrNo: req.body.patient,
          firstName: details.patient_details.first_name,
          lastName: details.patient_details.last_name,
          age: age,
          gender: details.patient_details.gender,
          uploadedBy: user.emailId,
          diagCentreName: user.diagCentreName,
          diagCentre: user.diagCentre,
          centreShortCode: user.centreShortCode,
          centreCode: user.centreCode
        })
        newUpload.save().then(pat => {
          res.json({ mid: pat._id })
        }).catch(err => {
        })
      }
    }).catch(err => {
      res.status(400).json({inValid: 'Some thing is wrong try later'})
    })
    // request.get({ api: API_KEY, qs: req.body }, (err, res, body) => {
    //   if (body.status === 'FAIL') {
    //     console.log(err)
    //   } else {
    //     console.log({ sqlPat: body.patient_details, dob: body.patient_details.dob })
    //     let today = new Date();
    //     let birthDate = new Date(body.patient_details.dob);
    //     let age = today.getFullYear() - birthDate.getFullYear();
    //     let m = today.getMonth() - birthDate.getMonth();
    //     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //       age--;
    //     }
    //     console.log(birthDate, age)
    //     const newUpload = new Patient({
    //       mrNo: req.body.patient,
    //       firstName: body.patient_details.first_name,
    //       lastName: body.patient_details.last_name,
    //       age: age,
    //       gender: body.patient_details.gender,
    //       uploadedBy: user.emailId,
    //       diagCentreName: user.diagCentreName,
    //       diagCentre: user.diagCentre,
    //       centreShortCode: user.centreShortCode,
    //       centreCode: user.centreCode
    //     })
    //     newUpload.save().then(pat => {
    //       console.log({ "created user": pat._id })
    //       res.json({ mid: pat._id })
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   }
    // })
  })
})
router.post('/onDiscard',passport.authenticate('all_diag',{session: false}),(req, res) => {
  Patient.deleteOne({_id: req.body.mid}).then(patient => {
  }).catch(err => {
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

    })
  })

router.post('/grantUserAccess',passport.authenticate('diag_admin', {session: false}),
  (req, res) => {
    User.findOneAndUpdate({emailId: req.body.emailId},{access: true}).then(user => {
      res.json({success: true})
    }).catch(err => {
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