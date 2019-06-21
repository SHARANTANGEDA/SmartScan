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
  diagCentre: {
    type: String
  },
  diagCentreName: {
    type: String
  },
  transit: {
    type: Boolean,
    default: true
  },
  scanType: {
    type: String
  },
  remarks: {
    type: String,
    default: ''
  }
});

module.exports = Patient = mongoose.model('patient',PatientSchema);

