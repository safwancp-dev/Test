
const jwt=require('jsonwebtoken')
const User=require('../model/userSchema')
const Admin = require('../model/adminSchema')
const Product=require('../model/productSchema')


require('dotenv').config()


const renderadminlogin=(req,res)=>{
    res.render('admin/adminlog')
}


const renderdashboard=async (req,res)=>{
    try{
        const userCount =await User.countDocuments()
        const productCount =await Product.countDocuments()
        console.log("user fetched from mongodb")
        res.render('admin/admindashboard',{userCount,productCount})
    }catch(err){
        console.log('error rendering dashboard',err)
        res.status(500).send('error dashboard loading')
    }
}


const adminlogin=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const admin=await Admin.findOne({email})
        if(!admin){
           
            return res.status(401).send({msg:'Admin not found'})
           
        }
        if(admin.password !==password){
            return res.status(401).send("invalid email or password")

        }
        console.log("password is matched")
       
        const token = jwt.sign(
            { admin: admin._id, email: admin.email },
            process.env.ADMIN_JWT,
            { expiresIn: "1h" }
        );
        if(!token){
            res.status(401).json(error)
            console.log("error token not created")
        }
        res.cookie("token", token, { httpOnly: true });
       
        console.log('admin login successfull')
        res.redirect('/admin/dashboard')
    }catch(err){
        console.log(err)
        return res.status(500).send('server error')
    }
}


const renderusermanagement = async (req, res) => {
    try {
      const user = await User.find();
      if (!user) {
        return res.status(401).send("No users found in the user management");
      }
      res.render('admin/usermanagement', { user });
    } catch (err) {
      res.status(500).send("Error loading user management page");
    }
  }

const blockuser=async(req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id)
        if(!user){
            return res.status(401).json('user not found')
        }
        user.isBlocked=!user.isBlocked;
        await user.save()
            console.log(`user ${user.isBlocked ?'blocked':'unbloked'}succesfully`)
            res.redirect('/admin/usermanagement')
        
    }catch(err){
        res.status(401).send('error user is blocking error',err)
    }
}
  
const adminlogout=(req,res)=>{
    res.clearCookie('token');
    console.log('admin logouted ')
  res.redirect('/admin/adminlogin');
}

module.exports={renderadminlogin,renderdashboard,adminlogin,renderusermanagement,blockuser,adminlogout}