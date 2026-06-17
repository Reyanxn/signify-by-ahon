const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Setting = require('../models/Setting');

const seedData = async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Banner.deleteMany({});
  await Setting.deleteMany({});

  await User.create({ name: 'Admin', email: 'admin@signifyahon.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Customer', email: 'customer@signifyahon.com', password: 'customer123', role: 'customer' });

  const categories = await Category.insertMany([
    { name: 'New Arrivals', slug: 'new-arrivals', order: 1 },
    { name: 'Formals', slug: 'formals', order: 2 },
    { name: 'Unstitched Summer', slug: 'unstitched-summer', order: 3 },
    { name: 'Ready to Wear', slug: 'ready-to-wear', order: 4 },
    { name: 'Semi Formals', slug: 'semi-formals', order: 5 },
    { name: 'Unstitched Winter', slug: 'unstitched-winter', order: 6 },
    { name: 'Special Prices', slug: 'special-prices', order: 7 },
  ]);

  await Banner.insertMany([
    { title: 'New Arrivals', subtitle: 'Discover the Latest Trends', buttonText: 'Shop Now', buttonLink: '/shop?collection=new-arrivals', desktopImage: { url: 'https://placehold.co/1920x600/f5f5f5/333?text=New+Arrivals', alt: 'New Arrivals' }, mobileImage: { url: 'https://placehold.co/600x600/f5f5f5/333?text=New+Arrivals', alt: 'New Arrivals' }, position: 1, section: 'hero' },
    { title: 'Formals', subtitle: 'Elegance Redefined', buttonText: 'Shop Now', buttonLink: '/shop?collection=formals', desktopImage: { url: 'https://placehold.co/1920x600/f5f5f5/333?text=Formals', alt: 'Formals' }, mobileImage: { url: 'https://placehold.co/600x600/f5f5f5/333?text=Formals', alt: 'Formals' }, position: 2, section: 'hero' },
    { title: 'Unstitched Summer', subtitle: 'Stay Cool & Stylish', buttonText: 'Shop Now', buttonLink: '/shop?collection=unstitched-summer', desktopImage: { url: 'https://placehold.co/1920x600/f5f5f5/333?text=Unstitched+Summer', alt: 'Unstitched Summer' }, mobileImage: { url: 'https://placehold.co/600x600/f5f5f5/333?text=Unstitched+Summer', alt: 'Unstitched Summer' }, position: 3, section: 'hero' },
    { title: 'Ready to Wear', subtitle: 'Effortless Style', buttonText: 'Shop Now', buttonLink: '/shop?collection=ready-to-wear', desktopImage: { url: 'https://placehold.co/1920x600/f5f5f5/333?text=Ready+to+Wear', alt: 'Ready to Wear' }, mobileImage: { url: 'https://placehold.co/600x600/f5f5f5/333?text=Ready+to+Wear', alt: 'Ready to Wear' }, position: 4, section: 'hero' },
  ]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'Custom Size'];
  const productData = [
    { name: 'Digital Printed Lawn USE-9317', cat: 'Unstitched Summer', fabric: 'Lawn', pieces: '3 Pieces', price: 4950, featured: true },
    { name: 'Embroidered Khaddar FK-2345', cat: 'Formals', fabric: 'Khaddar', pieces: '3 Pieces', price: 8950, salePrice: 7450, trending: true },
    { name: 'Digital Printed Viscose RTW-1223', cat: 'Ready to Wear', fabric: 'Viscose', pieces: '3 Pieces', price: 8450, featured: true },
    { name: 'Embroidered Lawn EL-5678', cat: 'Unstitched Summer', fabric: 'Lawn', pieces: '3 Pieces', price: 5950, featured: true },
    { name: 'Digital Printed Premium Viscose UW-0100', cat: 'Unstitched Winter', fabric: 'Viscose', pieces: '3 Pieces', price: 4950, salePrice: 3450, trending: true },
    { name: 'Embroidered Chiffon UC-3064', cat: 'Semi Formals', fabric: 'Chiffon', pieces: '3 Pieces', price: 20500, trending: true },
    { name: 'Embroidered Velvet EV-8901', cat: 'Formals', fabric: 'Velvet', pieces: '3 Pieces', price: 12500, isNewArrival: true },
    { name: 'Digital Printed Lawn USE-9322', cat: 'Unstitched Summer', fabric: 'Lawn', pieces: '3 Pieces', price: 4950, trending: true },
    { name: 'Embroidered Jacquard Khaddar JK-1234', cat: 'Formals', fabric: 'Jacquard Khaddar', pieces: '3 Pieces', price: 10500, isNewArrival: true },
    { name: 'Embroidered Raw Silk RS-4567', cat: 'Semi Formals', fabric: 'Raw Silk', pieces: '3 Pieces', price: 15500, featured: true },
    { name: 'Digital Printed Lawn USE-9313', cat: 'Unstitched Summer', fabric: 'Lawn', pieces: '3 Pieces', price: 4950, trending: true },
    { name: 'Embroidered Lawn USE-9352', cat: 'Unstitched Summer', fabric: 'Lawn', pieces: '3 Pieces', price: 5950, trending: true },
  ];

  const products = productData.map((p, i) => {
    const cat = categories.find(c => c.name === p.cat);
    const saleP = p.salePrice || (Math.random() > 0.3 ? p.price - Math.floor(Math.random() * 2000) : undefined);
    return {
      name: p.name,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + i,
      description: 'Beautiful ' + p.fabric + ' design perfect for any occasion. Features intricate detailing and premium quality fabric.',
      category: cat._id, collection: p.cat, fabric: p.fabric, pieces: p.pieces,
      productType: 'Embroidered ' + p.fabric, regularPrice: p.price, salePrice: saleP,
      inStock: Math.random() > 0.15, quantity: Math.floor(Math.random() * 50) + 5,
      sizes: sizes.slice(0, Math.floor(Math.random() * 4) + 2).map(s => ({ name: s, inStock: Math.random() > 0.2 })),
      isStitchedAvailable: Math.random() > 0.4,
      images: [
        { url: 'https://placehold.co/800x1000/f5f5f5/333?text=' + encodeURIComponent(p.name.substring(0, 20)), alt: p.name },
        { url: 'https://placehold.co/800x1000/eee/333?text=' + encodeURIComponent(p.name.substring(0, 20)) + '+2', alt: p.name + ' view 2' },
      ],
      featured: p.featured || false, trending: p.trending || false, isNewArrival: p.isNewArrival || false,
    };
  });

  await Product.insertMany(products);

  await Setting.insertMany([
    { key: 'siteName', value: 'SIGNIFY BY AHON' },
    { key: 'siteDescription', value: 'Premium Fashion & Clothing Store' },
    { key: 'currency', value: 'BDT' },
    { key: 'freeShippingThreshold', value: 5000 },
    { key: 'shippingCost', value: 200 },
    { key: 'socialLinks', value: { facebook: '#', instagram: '#', youtube: '#', tiktok: '#', whatsapp: '#' } },
    { key: 'contactInfo', value: { phone: '+880 1234 567890', email: 'info@signifyahon.com', address: 'Dhaka, Bangladesh' } },
  ]);
};

module.exports = seedData;
