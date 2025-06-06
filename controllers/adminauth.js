
const jwt=require('jsonwebtoken')
const User=require('../model/userSchema')
const Admin = require('../model/adminSchema')
const Product=require('../model/productSchema')
const Order=require('../model/orderSchema')
const Banner=require('../model/bannerSchema')
const Coupon=require('../model/couponSchema')
require('dotenv').config()


const renderadminlogin=(req,res)=>{
    res.render('admin/adminlog')
}


const renderBanner=async(req,res)=>{
    try{
        const banners=await Banner.find()
        res.render('admin/bannerManagement',{banners})
    }catch(err){
        console.log('error rendering banner management',err)
        res.status(500).send('server error')

    }
}

// Handle banner creation

const addBanner=async(req,res)=>{
    try{
        const imageUrls=req.files.map(file=>file.path)

        const newBanner=new Banner({imageUrls})
        await newBanner.save()
        res.redirect('/admin/bannerManagement')
    }catch(err){
        console.log('error adding banner',err)
        res.status(500).send('error adding banner')
    }
}

const deleteBanner=async(req,res)=>{
    try{
        const {id}=req.params
        await Banner.findByIdAndDelete(id)
        res.redirect('/admin/bannerManagement')
       
    }catch(err){
        console.log('error deleting banner',err)
        return res.status(400).send('error deleting product')
    }
}
const renderdashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    const currentYear = new Date().getFullYear();

    const orders = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyRevenue = Array(12).fill(0);
    orders.forEach(order => {
      monthlyRevenue[order._id - 1] = order.totalRevenue;
      console.log(monthlyRevenue)
    });

    res.render('admin/admindashboard', { userCount, productCount, orderCount, monthlyRevenue });
  } catch (err) {
    console.error('Error rendering dashboard', err);
    res.status(500).send('Error loading dashboard');
  }
};


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
            { expiresIn: "7d" }
        );
        if(!token){
            res.status(401).json(error)
            console.log("error token not created")
        }
        res.cookie("admintoken", token, { httpOnly: true });
       
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

const getorders=async(req,res)=>{
    try{
      
        const orders=await Order.find()
        .populate('user')
        .populate('items.product')
     

        res.render('admin/orderMangement',{orders})
    }catch(err){
 console.error('Error fetching orders:', err);
    res.status(500).send('Server Error');
    }
}
const orderView=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const orders=await Order.findOne({_id:orderId})
        .populate('user')
        .populate('items.product')
        res.render('admin/order-view',{orders})
    }catch(err){
        console.log('error viewing orders in order management ')
        res.status(500).send('server error')

    }

}

const updateOrderstatus=async(req,res)=>{
    try{
        const orderId=req.params.id
        const {status}=req.body
        
        const order=await Order.findById(orderId)
        if(!order){
            return res.status(400).send('order not found')
        }
        order.status=status
        await order.save()
        
        return res.redirect('/admin/orderManagement')
    }catch(err){
        console.log('error updating status',err)
        return res.status(400).send('error updating status')
    }
}



const adminlogout=(req,res)=>{
    res.clearCookie('token');
    console.log('admin logouted ')
  res.redirect('/admin/adminlogin');
}

//coupen creating

const getCouponspage=async(req,res)=>{
    try{
         const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.render('admin/createCoupon',{coupons})
    }catch(err){
        console.error('Error loading coupons page:', err);
        res.status(400).send('error loading coupens page',err)
    }
}

const addCoupon=async(req,res)=>{
    try{
        const {code,discountType,discountValue,minPurchaseAmount,expiryDate}=req.body
        const existing=await Coupon.findOne({code:code.toUpperCase()})
        if(existing){
            return res.status(400).send('coupon code already exist')
        }

        const newCoupon=new Coupon({
            code:code.toUpperCase(),
            discountType,
            discountValue,
            minPurchaseAmount,
            expiryDate,
        })
        await newCoupon.save()
        res.redirect('/admin/createCoupon')
    }catch(err){
        res.status(500).send('failed to create coupon')
    }
}

// Delete coupon by id'
const deleteCoupon=async(req,res)=>{
    try{
        await Coupon.findByIdAndDelete(req.params.id)
        res.redirect('/admin/createCoupon')
    }catch(err){
        res.status(400).send('error deleting coupen')
    }
}






module.exports={renderadminlogin,renderdashboard,renderBanner,addBanner,deleteBanner,adminlogin,renderusermanagement,blockuser,getorders,adminlogout,orderView,updateOrderstatus,getCouponspage,addCoupon,deleteCoupon}