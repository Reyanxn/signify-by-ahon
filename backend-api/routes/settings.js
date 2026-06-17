const express = require('express');
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { const s = await Setting.find(); const m = {}; s.forEach(x => m[x.key] = x.value); res.json(m); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/', protect, admin, async (req, res) => {
  try { for (const [k, v] of Object.entries(req.body)) { await Setting.findOneAndUpdate({ key: k }, { value: v }, { upsert: true }); } const s = await Setting.find(); const m = {}; s.forEach(x => m[x.key] = x.value); res.json(m); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
