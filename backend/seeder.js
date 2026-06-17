require('dotenv').config();
const connectDB = require('./config/db');
const seedData = require('./seedData');

connectDB().then(async () => {
  await seedData();
  console.log('Seeding complete!');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
