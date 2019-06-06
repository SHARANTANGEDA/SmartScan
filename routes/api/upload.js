const Grid = require('gridfs-stream')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const passport = require('passport')

//@MongoDB Atlas Connection
const db = require('../../config/keys').mongoURI
const mongoose = require('mongoose')
const Patient = require('../../models/Patient')

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
      // crypto.randomBytes(16, (err, buf) => {
      //   if (err) {
      //     return reject(err)
      //   }
      //   const filename =  buf.toString('hex')
      //
      // })
      Patient.findOneAndUpdate({empty: true},{$inc: {photos:1}},{new: true}).then(patient => {
        const filename =  patient._id.toString()+'_'+(patient.photos-1).toString()
        console.log({patientUpload: patient})
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        console.log(fileInfo)
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
router.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false })
    } else {
      files.map(file => {
        //TODO Change
        file.isImage = file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png';
      })
      res.render('index', { files: files })
    }
  })
})

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload',passport.authenticate('MRI',{session: false}),
  upload.array('file'), (req, res) => {
  console.log(req.files)
    Patient.findOneAndUpdate({empty: true},{empty: false}).then(patient => {
      console.log({patient: patient})
      return res.json({
        success: true
      })
    })
})

// @route GET /files
// @desc  Display all files in JSON
router.get('/files',passport.authenticate('lvpei',{session: false}), (req, res) => {
  let arr=[];
  Patient.find({empty: false}).then(patients => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      }else {
        patients.forEach(patient => {
          let temp=[];
          files.forEach(file => {
            let nm = patient._id.toString()
            console.log(file)
            let ind = file.filename.lastIndexOf('_')
            console.log(file.filename.substr(0,ind), nm)
            if(file.filename.substr(0,ind)===nm) {
              temp.push(file);
            }
          })
          console.log({name: temp})
          arr.push({name:patient.name,id: patient._id,files: temp})
        })
        // Files exist
        return res.json(arr)
      }
    })
  })

})

router.get('/files/:id', (req, res) => {
  Patient.findById(req.params.id).then(patient => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        })
      }else {
          let temp=[];
          files.forEach(file => {
            let nm = patient._id.toString()
            console.log(file)
            let ind = file.filename.lastIndexOf('_')
            console.log(file.filename.substr(0,ind), nm)
            if(file.filename.substr(0,ind)===nm) {
              temp.push(file);
            }
          })
        console.log({name: temp})
        return res.json({name:patient.name,id: patient._id,files: temp})
      }
    })
  })

})

router.get('/downloadFile/:id', (req, res) => {
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
      root: "uploads"
    });
    // set the proper content type
    res.set('Content-Type', files[0].contentType)
    res.set('Content-Disposition', 'attachment; filename="' + files[0].contentType + '"');
    // Return response
    readstream.pipe(res);
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

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: 'Not an image'
      })
    }
  })
})

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err })
    }

    res.redirect('/')
  })
})

module.exports = router