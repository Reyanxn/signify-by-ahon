const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const connectDB = require('./config/db');
const seedData = require('./config/seedData');

let cachedDb = null;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));
app.use('/api/settings', require('./routes/settings'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

module.exports = async (req, res) => {
  if (!cachedDb) {
    cachedDb = await connectDB();
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('No data found, seeding database...');
      await seedData();
      console.log('Database seeded!');
    }
  }
  return app(req, res);
};
