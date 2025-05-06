const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
  color:{type:String  ,default: ''},
  
  description: { type: String },                                        
  image: {
    type: String, // This will store the path or URL of the uploaded image
    required: true,
},                                              
  isBlocked: { type: Boolean, default: false }    ,                     
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
