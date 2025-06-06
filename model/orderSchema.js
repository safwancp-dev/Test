const mongoose=require('mongoose')


const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
            quantity:Number
        }
    ],
    shippingAddress:{
        fullName:{type:String},
        address:{type:String,required:true},
        city:{type:String,required:true},
        postalCode:{type:String,required:true},
        phone:{type:String,required:true},
    },
    paymentMethod:{
        type:String,
        enum:['COD','Online'],
        required:true,
    },
    paymentStatus:{
        type:String,
        enum: ['paid', 'pending', 'failed', 'refunded'],

        default:'paid' //paid or failed
    },
    status:{
        type:String,
        enum:['pending','delivered','paid','cancelled','shipped'],
        default:'pending'
    },
    stripeSessionId: {
    type: String,
    unique: true,
    sparse: true
  },
    totalAmount:Number,
    createdAt:{
        type:Date,
        default:Date.now
    },

},{ timestamps: true })

module.exports=mongoose.model('Order',orderSchema)