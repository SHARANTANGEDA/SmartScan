const express = require('express')
const router = express.Router()
const passport = require('passport')

const Patient = require('../../mongoModels/Patient')

router.get('/home', passport.authenticate('diag', { session: false }), (req, res) => {
      Patient.find({diagCentre:req.user.diagId}).then(patients => {
        Patient.find({uploadedBy: req.user.emailId}).then(pat => {
          res.json({
             totalUploads: patients.length, myUploads: pat.length
          })
        })
  }).catch(err => {
    res.status(404).json('Please try again later, there seems to be a problem on our side')
  })
});


module.exports = router