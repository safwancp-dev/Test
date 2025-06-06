const mongoose=require('mongoose')

const couponSchema=new mongoose.Schema({
    code:{type:String,required:true,unique:true},
    discountType:{type:String,enum:['flat','percentage'],required:true},
    discountValue:{type:Number,required:true},
    minPurchaseAmount:{type:Number,required:true},
    usedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    expiryDate:{type:Date,required:true},
},{timestamps:true})

module.exports=mongoose.model('Coupon',couponSchema)