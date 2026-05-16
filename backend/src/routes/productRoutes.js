const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

/**
 * GET /api/products
 * Returns list of products with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { gender, category, ageGroup, occasion, search } = req.query;
    const filter = { isActive: true };

    if (gender) {
      filter.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (ageGroup) filter.ageGroup = ageGroup;
    if (occasion) filter.occasion = occasion;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});

    const demo = [
      {
        name: 'Men Basic T-Shirt',
        description: 'Soft cotton tee',
        price: 799,
        category: 'clothing',
        gender: 'men',
        ageGroup: 'adult',
        occasion: 'casual',
        image: 'https://images.pexels.com/photos/10026491/pexels-photo-10026491.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        name: 'Women Black Dress',
        description: 'Elegant party wear',
        price: 1599,
        category: 'clothing',
        gender: 'women',
        ageGroup: 'adult',
        occasion: 'party',
        image: 'https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        name: 'Classic Leather Belt',
        description: 'Genuine leather belt',
        price: 999,
        category: 'belt',
        gender: 'men',
        ageGroup: 'adult',
        occasion: 'formal',
        image: 'https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ];

    const created = await Product.insertMany(demo);
    return res.json({ inserted: created.length });
  } catch (err) {
    console.error('GET /api/products/seed error:', err);
    return res.status(500).json({ message: 'Seed failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
