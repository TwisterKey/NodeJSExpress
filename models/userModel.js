const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A user password must have more or equal then 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;