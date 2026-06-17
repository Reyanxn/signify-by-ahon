const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  sku: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  collection: { type: String, default: '' },
  fabric: { type: String, default: '' },
  pieces: { type: String, default: '3 Pieces' },
  productType: { type: String, default: '' },
  regularPrice: { type: Number, required: true },
  salePrice: { type: Number },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  sizes: [{ name: String, inStock: Boolean }],
  isStitchedAvailable: { type: Boolean, default: false },
  images: [{ url: String, alt: String }],
  videos: [{ url: String, type: { type: String, enum: ['youtube', 'uploaded'] } }],
  tags: [String],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  discountPercent: { type: Number, default: 0 },
  attributes: [{ key: String, value: String }],
  seoTitle: String,
  seoDescription: String,
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.regularPrice && this.salePrice) {
    this.discountPercent = Math.round(((this.regularPrice - this.salePrice) / this.regularPrice) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
