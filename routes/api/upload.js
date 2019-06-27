const dateDiffInDays = require( '../../validations/dateDiffInDays')
const Grid = require('gridfs-stream')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const archiver = require('archiver')

const fs = require('fs')
//@MongoDB Atlas Connection
const db = require('../../config/keys').mongoURI
const mongoose = require('mongoose')
const Patient = require('../../mongoModels/Patient')
const User = require('../../mongoModels/User')
const Diagnostics = require('../../mongoModels/Diagnostics')
// const zipStream = require('zip-stream')
const sqldb = require('../../models')

let gfs

const conn = mongoose.createConnection(db, { useNewUrlParser: true })
conn.once('open', () => {
  // Init stream
  console.log('MongoDB Connected in upload')
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
})
const storage = new GridFsStorage({
  url: require('../../config/keys').mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      Patient.findOneAndUpdate({ transit: true, uploadedBy: req.user.emailId },
        { $inc:{ files: 1 }}, { new: true }).then(patient => {
          User.findOneAndUpdate({emailId: req.user.emailId},{$inc: {totalUploads: 1}},
            { new: true }).then(user => {
            const filename =patient.mrNo.toString()+';'+patient._id.toString() + ';' + file.originalname
            const fileInfo = {
              filename: filename,
              metadata: {
                pinned: false,
                patientId:patient._id.toString(),
                mrNo: patient.mrNo,
                centreCode: patient.centreCode
              },
              bucketName: 'uploads'
            }
            resolve(fileInfo)
          }).catch(err => {
            console.log('You have not Added patient Name, please do it to complete upload')
            reject(err)
          })
      }).catch(err => {
        console.log('You have not Added patient Name, please do it to complete upload')
        reject(err)
      })
    })
  }
})
const upload = multer({ storage })

// @route GET /
// @desc Loads form
// router.get('/', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       res.render('index', { files: false })
//     } else {
//       files.map(file => {
//         // Change
//         file.isImage = file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//       })
//       res.render('index', { files: files })
//     }
//   })
// })

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', passport.authenticate('all_diag', { session: false }),
  upload.array('file'), (req, res) => {
  if(req.body.remarks===null) {
    Patient.findOneAndUpdate({ transit: true,uploadedBy: req.user.emailId },
      { transit: false,lastUploadAt: Date.now(), scanType: req.body.category,}).then(patient => {
        console.log('here')
        console.log({'here':req.user.diagId})
      Diagnostics.findOneAndUpdate({orgEmail:req.user.diagId}, {$inc:{totalUploads: patient.files}})
        .then(diag => {
          return res.json({
            success: true
          })
        })
    })
  }else {
    Patient.findOneAndUpdate({ transit: true,uploadedBy: req.user.emailId },
      { transit: false,lastUploadAt: Date.now(), scanType: req.body.category,
      remarks: req.body.remarks}).then(patient => {
      console.log('here')
      console.log({'here':req.user.diagCentre})
      Diagnostics.findOneAndUpdate({orgEmail:req.user.diagCentre}, {$inc:{totalUploads: patient.files}})
        .then(diag => {
          return res.json({
            success: true
          })
        })
    })
  }

  })

// @route GET /files
// // @desc  Display all files in JSON
// router.get('/files', passport.authenticate('lvpei', { session: false }), (req, res) => {
//   let arr = []
//   Patient.find({ empty: false }).then(patients => {
//     gfs.files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'No files exist'
//         })
//       } else {
//         patients.forEach(patient => {
//           let temp = []
//           files.forEach(file => {
//             let nm = patient._id.toString()
//             let ind = file.filename.lastIndexOf(';')
//             if (file.filename.substr(0, ind) === nm) {
//               temp.push(file)
//             }
//           })
//           arr.push({ name: patient.name, id: patient._id, files: temp })
//         })
//         // Files exist
//         return res.json(arr)
//       }
//     })
//   })
//
// })

// @route GET /files
// @desc  Display all files in a Folder
router.get('/files/:id',  passport.authenticate('lvpei',{session: false}),(req, res) => {
  Patient.findById(req.params.id).then(patient => {
    gfs.files.find({'metadata.patientId':req.params.id}).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      } else {
        console.log(files)
        return res.json({ patient: patient, files: files })
      }
    })
  }).catch(err => {
    console.log(err)
  })
})
// @route GET /files
// @desc  Display all files in a Folder
router.get('/selectedFiles/:id',  passport.authenticate('lvpei',{session: false}),(req, res) => {
  Patient.findById(req.params.id).then(patient => {
    gfs.files.find({'metadata.patientId':req.params.id,'metadata.pinned': true}).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      } else {
        console.log(files)
        return res.json({ patient: patient, files: files })
      }
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/pinFile',passport.authenticate('lvpei',{session: false}), (req, res) => {
  gfs.files.update({filename: req.body.filename},{$set:{'metadata.pinned': true}}).then(file => {
    console.log(file)
    res.json({success: true})
  }).catch(err => {
    console.log(err)
  })
})

router.post('/unPinFile',passport.authenticate('lvpei',{session: false}), (req, res) => {
  gfs.files.update({filename: req.body.filename},{$set:{'metadata.pinned': false}}).then(file => {
    console.log(file)
    res.json({success: true})
  }).catch(err => {
    console.log(err)
  })
})


// @route Download /files
// @desc  Download Single File
router.get('/downloadFile/:id', passport.authenticate('lvpei',{session: false}), (req, res) => {
  gfs.files.find({filename: req.params.id}).toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      })
    }
    // create read stream
    let readstream = gfs.createReadStream({
      filename: files[0].filename,
      root: 'uploads'
    })
    // set the proper content type
    res.set('Content-Type', files[0].contentType)
    res.set('Content-Disposition', 'attachment; filename="' + files[0].contentType + '"')
    // Return response
    readstream.pipe(res)
  })
})

// @route Download multiple files
// @desc  Download Complete Folder
// router.post('/downloadNoZipFolder/:id', passport.authenticate('lvpei',{session: false}),
//   (req, res) => {
//   Patient.findById(req.params.id).then(patient => {
//     gfs.files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'No files exist'
//         })
//       }
//
//       files.forEach(file => {
//         let nm = patient._id.toString()
//         let ind = file.filename.lastIndexOf(';')
//
//         if (file.filename.substr(0, ind) === nm) {
//           let readstream = gfs.createReadStream({
//             filename: file.filename,
//             root: 'uploads'
//           })
//           // set the proper content type
//           res.set('Content-Type', file.contentType)
//           res.set('Content-Disposition', 'attachment; filename="' + file.contentType + '"')
//           // Return response
//           readstream.pipe(fs.createWriteStream(req.body.path+file.filename+'.dcm'))
//         }
//       })
//     })
//   })
// })

router.get('/downloadSelected/:id',passport.authenticate('lvpei',{session: false}), (req, res) => {
  // Patient.findById(req.body.id).then(patient => {
    gfs.files.find({'metadata.patientId':req.params.id,'metadata.pinned': true}).toArray(async (err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      }
      console.log('here')
      let archive = archiver('zip')
      let dummy = []
      // archive.on('error', function (err) {
      //   throw err
      // })
      archive.pipe(res)
      files.forEach(file => {
        dummy.push(new Promise((resolve, reject) => {
          // let nm = patient._id.toString()
          // let start = file.filename.indexOf(';')
          // let last = file.filename.lastIndexOf(';')
          // if (file.filename.substr(start+1, nm.length) === nm && req.body.selected.includes(file.filename)) {
            let readstream = gfs.createReadStream({
              filename: file.filename,
              root: 'uploads'
            })
            res.set('Content-Type', file.contentType)
            res.set('Content-Disposition', 'attachment; filename="' + file.contentType + '"')
            archive.append(readstream, { name: file.filename.substring(
              file.filename.lastIndexOf(';')+1, file.filename.length) })
            resolve(readstream)
          // }
        }).catch(err => {
          console.log({ err: 'New error has occurred' })
        }))
      })

      await Promise.all([archive.finalize()]).then(res => {
      }).catch(err => {
        console.log('error: '+err)
      })
    })
  // })
})
// @route Download multiple files
// @desc  Download Complete Folder(ZIP)
router.get('/downloadFolder/:id', passport.authenticate('lvpei',{session: false}), (req, res) => {
  Patient.findById(req.params.id).then(patient => {
    gfs.files.find().toArray(async (err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      }
      let archive = archiver('zip')
      let dummy = []
      // archive.on('error', function (err) {
      //   throw err
      // })
      archive.pipe(res)
      files.forEach(file => {
        dummy.push(new Promise((resolve, reject) => {
          let nm = patient._id.toString()
          let start = file.filename.indexOf(';')
          let last = file.filename.lastIndexOf(';')
          if (file.filename.substr(start+1, nm.length) === nm) {
            let readstream = gfs.createReadStream({
              filename: file.filename,
              root: 'uploads'
            })
            res.set('Content-Type', file.contentType)
            res.set('Content-Disposition', 'attachment; filename="' + file.contentType + '"')
            archive.append(readstream, { name: file.filename.substring(last+1, file.filename.length) })
            resolve(readstream)
          }
        }).catch(err => {
          console.log({ err: 'New error has occurred' })
        }))
      })

      await Promise.all([archive.finalize()]).then(res => {
      }).catch(err => {
        console.log('error: '+err)
      })
    })
  })
})

router.get('/folders/:id', passport.authenticate('lvpei', { session: false }), (req, res) => {
  Patient.find({mrNo: req.params.id}).then( patients => {
    res.json({mrNo: req.params.id, contents:patients})
  })
})
router.get('/patientsFolders', passport.authenticate('lvpei', { session: false }), (req, res) => {
  let mrNos = [], dummy = [], today = [], yesterday = [], lastweek = [], lastMonth = [], previous = [], all=[],
    KAR=[], KVC=[],GMRV=[],MTC=[]
  Patient.find().sort({ lastUpdateAt: -1 }).then(async patients => {
    const now = new Date()
    patients.map(patient => {
      dummy.push(new Promise((resolve, reject) => {
        console.log({ MR: mrNos })
        if (!mrNos.includes(patient.mrNo)) {

          // if(patient.centreCode==='KAR') {
          //   KAR.push(patient)
          // }else if(patient.centreCode==='KVC') {
          //   KVC.push(patient)
          // }else if(patient.centreCode==='GMRV') {
          //   GMRV.push(patient)
          // }else if(patient.centreCode==='MTC') {
          //   MTC.push(patient)
          // }

          let diff = dateDiffInDays(now, patient.lastUploadAt)
          console.log(diff)
          if (diff === 0) {
            today.push(patient)
          } else if (diff === 1) {
            yesterday.push(patient)
          } else if (diff > 1 && diff <= 7) {
            lastweek.push(patient)
          } else if (diff > 7 && diff <= 30) {
            lastMonth.push(patient)
          } else if (diff > 30) {
            previous.push(patient)
          }
          all.push(patient)
          mrNos.push(patient.mrNo)
        }
      }))
    })
    res.json({
      all: await Promise.all(all), today: await Promise.all(today),
      yesterday: await Promise.all(yesterday),
      lastweek: await Promise.all(lastweek), lastMonth: await Promise.all(lastMonth),
      previous: await Promise.all(previous)
    })
  })
})
// // @route GET /files/:filename
// // @desc  Display single file object
// router.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       })
//     }
//     // File exists
//     return res.json(file)
//   })
// })

// // @route GET /image/:filename
// // @desc Display Image
router.post('/displayDicom',passport.authenticate('lvpei',{session: false}), (req, res) => {
  gfs.files.findOne({ filename: req.body.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }
    const readstream = gfs.createReadStream(file.filename)
    if(file.contentType==='application/octet-stream') {
      readstream.pipe(res)
    }
  })
})

// @route DELETE /files/:id
// @desc  Delete file
router.get('/deleteFile/:id', passport.authenticate('lvpei',{session: false}), (req, res) => {
  gfs.remove({ filename: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(400).json({ err: err })
    }
    let start = req.params.id.indexOf(';')
    let last = req.params.id.lastIndexOf(';')
    Patient.findByIdAndUpdate(req.params.id.substring(start+1, last),
      { $inc:{ files: 1 }, lastUploadAt:Date.now()}).then(patient => {
      res.redirect('/')
    }).catch(err => {
      return res.status(400).json({ err: err })
    })
  })
})

router.get('/deleteFolder/:id', passport.authenticate('lvpei',{session: false}), (req, res) => {
  let errcnt=0;
  Patient.findById(req.params.id).then(patient => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      } else {
          files.forEach(file => {
            let nm = patient._id.toString()
            let start = file.filename.indexOf(';')
            if (file.filename.substr(start+1, nm.length) === nm) {
              gfs.remove({ filename: file.filename, root: 'uploads' }, (err, gridStore) => {
                if (err) {
                  errcnt=errcnt+1;
                  return res.status(404).json({ err: err })
                }
              })
            }
          })
      }
    })
   })
  if(errcnt===0) {
    Patient.remove({_id:req.params.id}).then(patient => {
      res.redirect('/')
    }).catch(err => {
      console.log({error: err})
    })
  } else {
    alert('Error in deletion, please try again!!!')
    res.redirect('/')

  }
})

router.get('/deletePatient/:id', passport.authenticate('lvpei',{session: false}), (req, res) => {
  Patient.find({mrNo:req.params.id}).then(patients => {
    patients.map(patient => {
      let errcnt=0, dummy=[];

      gfs.files.find().toArray(async (err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: 'No files exist'
          })
        } else {
          files.forEach(file => {
            dummy.push(new Promise((resolve, reject) => {
              let nm = patient._id.toString()
              let start = file.filename.indexOf(';')
              if (file.filename.substr(start + 1, nm.length) === nm) {
                gfs.remove({ filename: file.filename, root: 'uploads' }, (err, gridStore) => {
                  if (err) {
                    errcnt = errcnt + 1;
                    return res.status(404).json({ err: err })
                  }
                })
              }
            }))
          })
          console.log('delete done')
            console.log('in res')
            if (errcnt === 0) {
              dummy.push(new Promise((resolve, reject) => {
                Patient.remove({ _id: patient._id }).then(patient => {
                  res.redirect('/')
                }).catch(err => {
                  console.log({ error: err })
                })
              }))
              await Promise.all(dummy)
            } else {
              alert('Error in deletion, please try again!!!')
              res.redirect('/')
            }
        }
      })
    })

  })
})







module.exports = router