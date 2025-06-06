const express = require("express");
const router = express.Router();
const upload = require("../utils/multer-cloudinary");
const {
  renderadminlogin,
  adminlogin,
  adminlogout,
  renderdashboard,
  renderusermanagement,
  blockuser,
  getorders,
  orderView,
  updateOrderstatus,
  renderBanner,
  addBanner,
  deleteBanner,
  getCouponspage,
  addCoupon,
  deleteCoupon
} = require("../controllers/adminauth");

const verify = require("../middleware/adminVerify");

const {
  createCategory,
  addCategory,
  getAddProduct,
  addProduct,
  getproducts,
  deleteproduct,
  geteditproduct,
  updateproduct,
} = require("../controllers/productController");
const adminVerify = require("../middleware/adminVerify");
const { getMesage, deleteMessage } = require("../controllers/contactControllers");

// Admin authentication
router.get("/adminlogin", renderadminlogin);
router.post("/adminlogin", adminlogin);
router.post("/adminlogout", adminlogout);

// Dashboard and management
router.get("/dashboard",adminVerify, renderdashboard);
router.get("/usermanagement",adminVerify,renderusermanagement);
router.post("/block-user/:id", blockuser);

// Category
router.get("/addcategory",adminVerify, createCategory);
router.post("/addcategory", addCategory);

// Product
router.get("/addproduct",adminVerify, getAddProduct);
router.post("/addproduct", upload.array("image[]",6), addProduct);
router.get("/productManagement",adminVerify, getproducts);
router.post("/deleteproduct/:id", deleteproduct);
router.get("/editproduct/:id",adminVerify, geteditproduct);
router.post("/update-product/:id", upload.array("image[]",6), updateproduct);

//banner
router.get('/bannerManagement',adminVerify,renderBanner)
router.post('/add-banners',upload.array('imageUrls[]',6),adminVerify,addBanner)
router.post('/banner-delete/:id',adminVerify,deleteBanner)
//orders
router.get('/orderManagement',adminVerify,getorders)
router.get('/order-view/:id',adminVerify,orderView)
router.post("/update-orderstatus/:id",adminVerify,updateOrderstatus)


// messages
router.get('/messages',adminVerify,getMesage)
router.post('/messages/delete/:messageId',adminVerify,deleteMessage)

router.get('/createCoupon',adminVerify,getCouponspage)
router.post('/addCoupon',adminVerify,addCoupon)
router.post('/deleteCoupons/:id',adminVerify,deleteCoupon)
module.exports = router;
