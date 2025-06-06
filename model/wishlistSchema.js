const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // This ensures only one wishlist per user
  },
  products: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true,
    
  }],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
