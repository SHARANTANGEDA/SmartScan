const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  name: {
    type: String,
    required:true
  },
  empty: {
    type: Boolean,
    default:true
  },
  photos: {
    type: Number,
    default: 0
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = Patient = mongoose.model('patient',PatientSchema);

