const mongoose=require('mongoose')



const bannerSchema=new mongoose.Schema({
    imageUrls:[{
        type:String,
        
    }]
})

module.exports=mongoose.model('Banner',bannerSchema)