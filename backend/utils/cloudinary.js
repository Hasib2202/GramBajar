// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Create storage engine
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'grambajar',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }]
//   }
// });

// // Create multer parser
// const parser = multer({ storage: storage });

// module.exports = { cloudinary, parser };