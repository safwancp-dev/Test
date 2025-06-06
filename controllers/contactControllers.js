const Contact=require('../model/contact')

const submitContactform=async(req,res)=>{
    try{
    const {name,email,message}=req.body

    if(!name||!email||!message){
        return res.status(400).send('all fields are required')
    }
    await Contact.create({name,email,message})
    res.redirect('/contact-us')

    }catch(err){
        console.error(err)
        return res.status(500).send('something went wrong')
    }
}


const getMesage=async(req,res)=>{
    try{
        const searchQuery=req.query.search||''
        const filter=searchQuery?{name:{$regex:new RegExp(searchQuery,'i')}}:{};
        

        const messages=await Contact.find(filter).sort({createdAt :-1})
        res.render('admin/messages',{messages,searchQuery})
    }catch(err){
        console.log(err)
        return res.render('admin/messages',{messages:[],searchQuery:''})
    }
}

const deleteMessage=async(req,res)=>{
    try{
        const messageId=req.params.messageId
        await Contact.findByIdAndDelete(messageId)
        res.redirect('/admin/messages')

    }catch(err){
        console.error(err)
        res.status(400).send('err deleting messages')
    }
}
module.exports={submitContactform,getMesage,deleteMessage}