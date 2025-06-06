const express=require('express')
const router=express.Router();
const {renderhomepage,renderaboutpage,rendercontactus,rendersignuppage,signup,renderotppage,verifyOtp, renderloginpage,login,logout,renderforgotpassword,handleforgotpassword,renderresetpassword,handleresetpassword,getuserAccount,addAddress, deleteAddress, fetchValidCoupons, editProfile}= require('../controllers/useraauth');
const authenticateUser=require('../middleware/userVerify')
const{getShopProducts,viewProductdetails, getSearchShopItems, createReview}=require('../controllers/productController')

const { addTowishlist, removeFromwishlist, getWishlist}=require('../controllers/wishlistcontroller')
const{addCart,getCartPage,updateQuantity,getCheckoutPage, removeCartitem}=require('../controllers/cartController');
const { placeOrder, viewOrders, cancelOrder,paymentSuccess, applyCoupon } = require('../controllers/orderController');
const { submitContactform } = require('../controllers/contactControllers');


router.get('/home',authenticateUser,renderhomepage)
router.get('/about',authenticateUser,renderaboutpage)
router.get('/contact-us',authenticateUser,rendercontactus)
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
router.get('/my-account',authenticateUser,getuserAccount)
router.post('/edit-user',authenticateUser,editProfile)
router.post('/add-address',authenticateUser,addAddress)
router.post('/delete-address',deleteAddress)

router.get('/shop',authenticateUser,getShopProducts,)
router.get('/product/:id',authenticateUser,viewProductdetails)
router.get('/cart',authenticateUser,getCartPage)
router.get('/wishlist',authenticateUser,getWishlist)
router.post('/wishlist/add/:id',authenticateUser, addTowishlist)
router.post('/wishlist/remove/:id',authenticateUser,removeFromwishlist)

router.post('/search',authenticateUser,getSearchShopItems)
router.post('/update-cart/:id',authenticateUser,updateQuantity)
router.post('/add-to-cart/:id',authenticateUser,addCart)
router.post('/remove-cart/:id',authenticateUser,removeCartitem)
router.get('/checkout',authenticateUser,getCheckoutPage)
router.post('/place-order',authenticateUser,placeOrder)
router.get('/payment-success',authenticateUser, paymentSuccess)
router.get('/view-orders',authenticateUser,viewOrders)
router.post('/cancel-order/:id',authenticateUser,cancelOrder)

router.post('/contact',authenticateUser,submitContactform)

//coupon
router.post('/appl-coupon',authenticateUser,applyCoupon)
router.get('/offers',fetchValidCoupons)



router.post('/review/:id', authenticateUser, createReview);

module.exports=router;