const express = require('express');
const Banner = require('../models/Banner');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => { try { const q = { isActive: true }; if (req.query.section) q.section = req.query.section; res.json(await Banner.find(q).sort({ position: 1 })); } catch (error) { res.status(500).json({ message: error.message }); } });
router.get('/all', protect, admin, async (req, res) => { try { res.json(await Banner.find().sort({ position: 1 })); } catch (error) { res.status(500).json({ message: error.message }); } });
router.post('/', protect, admin, async (req, res) => { try { res.status(201).json(await Banner.create(req.body)); } catch (error) { res.status(500).json({ message: error.message }); } });
router.put('/:id', protect, admin, async (req, res) => { try { const b = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!b) return res.status(404).json({ message: 'Banner not found' }); res.json(b); } catch (error) { res.status(500).json({ message: error.message }); } });
router.delete('/:id', protect, admin, async (req, res) => { try { await Banner.findByIdAndDelete(req.params.id); res.json({ message: 'Banner deleted' }); } catch (error) { res.status(500).json({ message: error.message }); } });

module.exports = router;
