const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try { const q = req.user.role === 'admin' ? {} : { user: req.user._id }; res.json(await Order.find(q).populate('user', 'name email').populate('items.product', 'name images').sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try { const o = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name images slug'); if (!o) return res.status(404).json({ message: 'Order not found' }); if (o.user && o.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' }); res.json(o); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body; let subtotal = 0; const orderItems = [];
    for (const item of items) { const p = await Product.findById(item.product); if (!p) return res.status(404).json({ message: 'Product not found: ' + item.product }); const price = p.salePrice || p.regularPrice; subtotal += price * item.quantity; orderItems.push({ product: p._id, name: p.name, image: p.images[0]?.url || '', size: item.size, isStitched: item.isStitched, quantity: item.quantity, price }); }
    res.status(201).json(await Order.create({ user: req.user._id, items: orderItems, shippingAddress, paymentMethod, subtotal, shippingCost: subtotal > 5000 ? 0 : 200, total: subtotal + (subtotal > 5000 ? 0 : 200) }));
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try { const o = await Order.findById(req.params.id); if (!o) return res.status(404).json({ message: 'Order not found' }); o.status = req.body.status; if (req.body.trackingNumber) o.trackingNumber = req.body.trackingNumber; if (req.body.status === 'delivered') o.isDelivered = true; res.json(await o.save()); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/pay', protect, async (req, res) => {
  try { const o = await Order.findById(req.params.id); if (!o) return res.status(404).json({ message: 'Order not found' }); o.isPaid = true; o.paidAt = Date.now(); o.paymentResult = req.body.paymentResult; res.json(await o.save()); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
