const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  emailId: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  admin: {
      type: String
  },
  diagCentre: {
    type: String
  },
  diagCentreName: {
    type: String
  },
  access: {
    type: Boolean,
    default: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users',UserSchema);

