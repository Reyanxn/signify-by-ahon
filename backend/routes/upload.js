const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
    const extname = allowed.test(file.originalname.toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images and videos are allowed'));
  },
});

router.post('/', protect, admin, upload.array('files', 10), (req, res) => {
  try {
    const files = req.files.map(f => ({
      url: `/uploads/${f.filename}`,
      name: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
    }));
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/single', protect, admin, upload.single('file'), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.filename}`,
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
