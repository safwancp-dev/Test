const express=require('express')
const router=express.Router()
const upload=require('../utils/multer-cloudinary')
const{renderadminlogin,adminlogin,adminlogout,renderdashboard, renderusermanagement,blockuser}=require('../controllers/adminauth')

const { createCategory, addCategory ,getAddProduct,addProduct ,getproducts,deleteproduct, geteditproduct, updateproduct} = require('../controllers/productController')

// Admin authentication
router.get('/adminlogin', renderadminlogin);
router.post('/adminlogin', adminlogin);
router.post('/adminlogout', adminlogout);

// Dashboard and management
router.get('/dashboard', renderdashboard);
router.get('/usermanagement', renderusermanagement);
router.post('/block-user/:id', blockuser);

// Category
router.get('/addcategory', createCategory);
router.post('/addcategory', addCategory);

// Product
router.get('/addproduct', getAddProduct);
router.post('/addproduct', upload.single('image'),addProduct);
router.get('/productManagement', getproducts);
router.post('/deleteproduct/:id',deleteproduct)
router.get('/editproduct/:id',geteditproduct)
router.post('/update-product/:id',upload.single('image'),updateproduct)

module.exports=router;