const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isBlocked: { type: Boolean, default: false },
    address:{type:String},
    isVerified: { type: Boolean, default: false },
    otp:{type:String},
    otpExpiry: {
        type: Number,
      },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;