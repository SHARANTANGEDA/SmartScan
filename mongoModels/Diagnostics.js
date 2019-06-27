const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiagnosticSchema = new Schema({
  orgEmail: {
    type: String,
    required: true
  },
  centreName: {
    type: String,
    required: true
  },
  adminId: {
    type: String,
    required: true
  },
  members: [{
    id: {
      type: String
    }
  }],
  totalUploads: {
    type: Number,
    default: 0
  },
  short: {
    type: String,
    required: true
  },
  access: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  centreCode: {
    type: String
  }
});

module.exports = Diagnostics = mongoose.model('Diagnostics',DiagnosticSchema);

