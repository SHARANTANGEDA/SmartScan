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
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users',UserSchema);

