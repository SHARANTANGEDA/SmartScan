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
        const filename =  patient.name+'_'+(patient.photos-1).toString()
        console.log({patientUpload: patient})
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        console.log(fileInfo)
        resolve(fileInfo)
      }).catch(err => {
        console.log('You have not Added patient Name, please do it to complete upload')
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
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      })
    }

    // Files exist
    return res.json(files)
  })
})

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }
    // File exists
    return res.json(file)
  })
})

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