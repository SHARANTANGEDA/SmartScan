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
  }
});

module.exports = Diagnostics = mongoose.model('Diagnostics',DiagnosticSchema);

