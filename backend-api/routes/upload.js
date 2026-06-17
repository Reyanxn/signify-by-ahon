const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => { const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi/; if (allowed.test(file.originalname.toLowerCase()) && allowed.test(file.mimetype)) cb(null, true); else cb(new Error('Only images and videos are allowed')); },
});

router.post('/', protect, admin, upload.array('files', 10), async (req, res) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
      const results = [];
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const result = await cloudinary.uploader.upload('data:' + file.mimetype + ';base64,' + b64, { folder: 'signify-ahon' });
        results.push({ url: result.secure_url, name: file.originalname, size: file.size, mimetype: file.mimetype });
      }
      return res.json(results);
    }
    res.json(req.files.map(f => ({ url: 'data:' + f.mimetype + ';base64,' + Buffer.from(f.buffer).toString('base64'), name: f.originalname, size: f.size, mimetype: f.mimetype })));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/single', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const result = await cloudinary.uploader.upload('data:' + req.file.mimetype + ';base64,' + b64, { folder: 'signify-ahon' });
      return res.json({ url: result.secure_url, name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
    }
    res.json({ url: 'data:' + req.file.mimetype + ';base64,' + Buffer.from(req.file.buffer).toString('base64'), name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
