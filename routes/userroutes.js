const express=require('express')
const router=express.Router();
const {renderhomepage,renderaboutpage,rendersignuppage,signup,renderotppage,verifyOtp, renderloginpage,login,logout,renderforgotpassword,handleforgotpassword,renderresetpassword,handleresetpassword,getuserAccount,updateUser}= require('../controllers/useraauth');
const authenticateUser=require('../middleware/userVerify')
const{getShopProducts,viewProductdetails}=require('../controllers/productController')
const { addTwowishlist, removeFromwishlist, getWishlist}=require('../controllers/wishlistcontroller')
const{addCart,getCartPage,updateQuantity}=require('../controllers/cartController')

router.get('/home',authenticateUser,renderhomepage)
router.get('/about',authenticateUser,renderaboutpage)
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

router.get('/shop',authenticateUser,getShopProducts)
router.get('/product/:id',authenticateUser,viewProductdetails)
router.get('/cart',authenticateUser,getCartPage)
router.get('/wishlist',authenticateUser,getWishlist)
router.post('/wishlist/add/:id',authenticateUser, addTwowishlist)
router.post('/wishlist/remove/:id',authenticateUser,removeFromwishlist)


router.post('/update-cart/:id',authenticateUser,updateQuantity)
router.post('/add-to-cart/:id',authenticateUser,addCart)

module.exports=router;