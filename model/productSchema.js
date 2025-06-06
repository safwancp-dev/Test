const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
  reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}],
  color:{type:String  ,default: ''},
  
  description: { type: String },                                        
  image: [String],
                                        
  isBlocked: { type: Boolean, default: false }    ,
                   
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
