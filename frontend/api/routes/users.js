const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, admin, async (req, res) => {
  try { res.json(await User.find().select('-password').sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'User deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
