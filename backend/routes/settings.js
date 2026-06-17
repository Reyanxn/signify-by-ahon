const express = require('express');
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const map = {};
    settings.forEach(s => map[s.key] = s.value);
    res.json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, admin, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
    }
    const settings = await Setting.find();
    const map = {};
    settings.forEach(s => map[s.key] = s.value);
    res.json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
