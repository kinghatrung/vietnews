const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình storage multer để upload lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'BANK',
  format: 'webp',
  params: {
    folder: 'BANK',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ fetch_format: 'webp' }, { quality: 'auto' }],
  },
});

const upload = multer({ storage: storage });

const uploadController = {
  uploadImage: [
    upload.single('file'),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      res.json({
        link: req.file.path,
      });
    },
  ],
};

module.exports = uploadController;
