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
        const filename =patient.mrNo.toString()+';'+patient._id.toString() + ';' + file.originalname
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
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
    Patient.findOneAndUpdate({ transit: true,uploadedBy: req.user.emailId },
      { transit: false,lastUploadAt: Date.now()}).then(patient => {
      return res.json({
        success: true
      })
    })
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
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      } else {
        let temp = []
        files.forEach(file => {
          let nm = patient._id.toString()
          let start = file.filename.indexOf(';')
          if (file.filename.substr(start+1, nm.length) === nm) {
            temp.push(file)
          }
        })
        return res.json({ patient: patient, files: temp })
      }
    })
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
  let mrNos=[]
  Patient.find().then(async patients => {
    patients.map(patient => {
      mrNos.push(new Promise((resolve, reject) => {
        if (!mrNos.includes(patient.mrNo)) {
          resolve(patient.mrNo)
        }
      }))
    })
    res.json(await Promise.all(mrNos))
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
// router.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       })
//     }
//
//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename)
//       readstream.pipe(res)
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       })
//     }
//   })
// })

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
      let errcnt=0;

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
          if(errcnt===0) {
            Patient.remove({_id:patient._id}).then(patient => {
              res.redirect('/')
            }).catch(err => {
              console.log({error: err})
            })
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