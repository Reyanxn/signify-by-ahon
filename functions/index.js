const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/products', require('../backend/routes/products'));
app.use('/api/categories', require('../backend/routes/categories'));
app.use('/api/orders', require('../backend/routes/orders'));
app.use('/api/banners', require('../backend/routes/banners'));
app.use('/api/cart', require('../backend/routes/cart'));
app.use('/api/upload', require('../backend/routes/upload'));
app.use('/api/users', require('../backend/routes/users'));
app.use('/api/settings', require('../backend/routes/settings'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

exports.api = functions.https.onRequest(app);
