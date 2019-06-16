const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  mrNo: {
    type: String,
    required:true
  },
  uploadedBy: {
    type: String
  },
  files: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUploadAt: {
    type: Date,
    default: Date.now
  },
  transit: {
    type: Boolean,
    default: true
  }
});

module.exports = Patient = mongoose.model('patient',PatientSchema);

