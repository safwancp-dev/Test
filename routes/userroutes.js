const express=require('express')
const router=express.Router();
const {renderhomepage,renderaboutpage,rendersignuppage,signup,renderotppage,verifyOtp, renderloginpage,login,logout,renderforgotpassword,handleforgotpassword,renderresetpassword,handleresetpassword,getuserAccount,updateUser}= require('../controllers/useraauth');
const verify=require('../middleware/userVerify')
const{getShopProducts}=require('../controllers/productController')

const{addCart}=require('../controllers/cartController')

router.get('/home',renderhomepage)
router.get('/about',renderaboutpage)
router.get('/login',renderloginpage)
router.get('/signup',rendersignuppage)
router.post('/signup',signup)
router.post('/login',login)
router.get('/forgot-password',renderforgotpassword)
router.post('/forgot-password',handleforgotpassword)
router.get('/reset-password',renderresetpassword)
router.post('/reset-password',handleresetpassword)
router.get('/verify-otp/:id',renderotppage);
router.post('/verify-otp',verifyOtp);
router.post('/logout',logout)
router.get('/my-account',getuserAccount)
router.post('/update-user',updateUser)

router.get('/shop',getShopProducts)



router.post('/add-to-cart/:id',addCart)

module.exports=router;