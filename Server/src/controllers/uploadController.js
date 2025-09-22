import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import cloudinary from '../config/cloudinary.js';

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

export default uploadController;
