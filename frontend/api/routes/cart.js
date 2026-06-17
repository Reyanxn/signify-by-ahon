const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId }).populate('items.product');
  if (guestId) return await Cart.findOne({ guestId }).populate('items.product');
  return null;
};

router.get('/', protect, async (req, res) => {
  try { const cart = await getCart(req.user._id); res.json(cart || { items: [], total: 0 }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/guest/:guestId', async (req, res) => {
  try { const cart = await getCart(null, req.params.guestId); res.json(cart || { items: [], total: 0 }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/add', async (req, res) => {
  try {
    const { productId, size, isStitched, quantity, guestId } = req.body;
    let cart;
    if (req.user) cart = await Cart.findOne({ user: req.user._id });
    else if (guestId) cart = await Cart.findOne({ guestId });
    if (!cart) { cart = new Cart({ items: [] }); if (req.user) cart.user = req.user._id; if (guestId) cart.guestId = guestId; }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const price = product.salePrice || product.regularPrice;
    const existingItem = cart.items.find(i => i.product.toString() === productId && i.size === (size || '') && i.isStitched === (isStitched || false));
    if (existingItem) { existingItem.quantity += quantity || 1; }
    else { cart.items.push({ product: productId, size, isStitched, quantity: quantity || 1, price }); }
    await cart.save();
    res.json(await Cart.findById(cart._id).populate('items.product'));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/update/:itemId', async (req, res) => {
  try {
    const { quantity, guestId } = req.body;
    let cart;
    if (req.user) cart = await Cart.findOne({ user: req.user._id });
    else if (guestId) cart = await Cart.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (item) item.quantity = quantity;
    await cart.save();
    res.json(await Cart.findById(cart._id).populate('items.product'));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/remove/:itemId', async (req, res) => {
  try {
    const { guestId } = req.body;
    let cart;
    if (req.user) cart = await Cart.findOne({ user: req.user._id });
    else if (guestId) cart = await Cart.findOne({ guestId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json(await Cart.findById(cart._id).populate('items.product'));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
