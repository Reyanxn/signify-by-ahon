const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String, subtitle: String, description: String,
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/shop' },
  desktopImage: { url: String, alt: String },
  mobileImage: { url: String, alt: String },
  videoUrl: String,
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  section: { type: String, enum: ['hero', 'promo', 'featured'], default: 'hero' },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
