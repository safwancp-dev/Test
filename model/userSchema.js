const mongoose = require('mongoose');

const addressSchema=new mongoose.Schema({
  fullName:String,
  address:String,
  postalCode:String,
  city:String,
  phone:String,
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isBlocked: { type: Boolean, default: false },
    addresses:[addressSchema],
    isVerified: { type: Boolean, default: false },
    otp:{type:String},
    otpExpiry: {
        type: Number,
      },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;