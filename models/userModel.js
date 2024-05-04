/* eslint-disable radix */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'PLease confirm on password'],
    validate: {
      //asta merge numai la on create sau on save
      validator: function (el) {
        //el e passwordconfirm
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //run this function if password was modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12); //async version, this returns a promise

  this.passwordConfirm = undefined; //stergem ce este in passwordConfirm
  next();
});
//insatnce method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
