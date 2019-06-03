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
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + file.name
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
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
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true
        } else {
          file.isImage = false
        }
      })
      res.render('index', { files: files })
    }
  })
})

// @route POST /upload
// @desc  Uploads file to DB
const date = Date()
router.post('/upload',passport.authenticate('MRI',{session: false}),
  upload.array('file'), (req, res) => {
  console.log('Uploaded')
  console.log(req.files)
  return res.json({
    success: true,
  })
  // Patient.findOne({empty: true}).then(patient => {
  //   let arrayName = patient.name +'_'+ patient.time
  //   upload.array(arrayName)
  //   upload.array(`patient_MRI_${date.now()}`).then(res => {
  //
  //     res.json({done: 'All data are uploaded'});
  //   })
  // })
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