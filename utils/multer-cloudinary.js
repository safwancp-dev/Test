const multer=require('multer')
const {CloudinaryStorage}=require('multer-storage-cloudinary')

const cloudinary=require('./cloudinary')//cloudinary setup
const {folder, allowedFormats } = require('../config/params')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
      folder: folder,
      allowed_formats: allowedFormats,
      public_id: `product_${Date.now()}`,
    }),
  });

const upload=multer({storage})

module.exports=upload;