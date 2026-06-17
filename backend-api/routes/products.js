const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, collection, fabric, pieces, productType, minPrice, maxPrice, size, search, sort, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (collection) query.collection = { $regex: collection, $options: 'i' };
    if (fabric) query.fabric = { $regex: fabric, $options: 'i' };
    if (pieces) query.pieces = pieces;
    if (productType) query.productType = { $regex: productType, $options: 'i' };
    if (minPrice || maxPrice) { query.salePrice = {}; if (minPrice) query.salePrice.$gte = Number(minPrice); if (maxPrice) query.salePrice.$lte = Number(maxPrice); }
    if (size) query['sizes.name'] = size;
    if (search) query.name = { $regex: search, $options: 'i' };
    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { salePrice: 1 };
    else if (sort === 'price-desc') sortObj = { salePrice: -1 };
    else if (sort === 'name-asc') sortObj = { name: 1 };
    else if (sort === 'name-desc') sortObj = { name: -1 };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).populate('category', 'name slug').sort(sortObj).skip((page - 1) * limit).limit(Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/featured', async (req, res) => {
  try { res.json(await Product.find({ featured: true, inStock: true }).populate('category', 'name slug').limit(8)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/trending', async (req, res) => {
  try { res.json(await Product.find({ trending: true, inStock: true }).populate('category', 'name slug').limit(5)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try { const p = await Product.findByIdAndDelete(req.params.id); if (!p) return res.status(404).json({ message: 'Product not found' }); res.json({ message: 'Product deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
