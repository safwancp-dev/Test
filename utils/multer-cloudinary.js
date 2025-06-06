const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('./cloudinary'); // your Cloudinary setup
const { folder, allowedFormats } = require('../config/params');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: folder,
    resource_type: allowedFormats,
    public_id: `${file.originalname.split('.')[0]}_${Date.now()}`
  }),
});

const upload = multer({ storage });

module.exports = upload;
