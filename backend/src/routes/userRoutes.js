const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP or GIF images are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 4 * 1024 * 1024 } });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profileImage: user.profileImage || '',
  address: user.address || {
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  },
  gender: user.gender || 'prefer_not_to_say',
  dateOfBirth: user.dateOfBirth,
  wishlist: user.wishlist || [],
  cart: user.cart || [],
  role: user.role,
  emailVerified: user.emailVerified,
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -emailVerificationCodeHash -emailVerificationExpiresAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('status totalAmount items createdAt updatedAt');

    return res.json({
      user: sanitizeUser(user),
      orders,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put(
  '/profile',
  authenticateToken,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('phone').optional().trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
      .withMessage('Invalid gender value'),
    body('address.pincode')
      .optional()
      .trim()
      .isLength({ min: 6, max: 6 })
      .withMessage('Pincode must be 6 digits'),
    body('wishlist').optional().isArray().withMessage('Wishlist must be an array'),
    body('cart').optional().isArray().withMessage('Cart must be an array'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0]?.msg || 'Invalid request',
          errors: errors.array(),
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const {
        name,
        email,
        phone,
        profileImage,
        address,
        gender,
        dateOfBirth,
        wishlist,
        cart,
      } = req.body;

      if (email && email !== user.email) {
        const duplicateEmail = await User.findOne({ email, _id: { $ne: user._id } });
        if (duplicateEmail) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
        user.emailVerified = false;
      }

      if (phone && phone !== user.phone) {
        const duplicatePhone = await User.findOne({ phone, _id: { $ne: user._id } });
        if (duplicatePhone) {
          return res.status(400).json({ message: 'Phone already in use' });
        }
        user.phone = phone;
      }

      if (typeof name === 'string') user.name = name.trim();
      if (typeof profileImage === 'string') user.profileImage = profileImage;
      if (address && typeof address === 'object') {
        user.address = {
          addressLine: address.addressLine || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.pincode || '',
          country: address.country || '',
        };
      }
      if (typeof gender === 'string') user.gender = gender;
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
      if (Array.isArray(wishlist)) user.wishlist = wishlist.map(String);
      if (Array.isArray(cart)) {
        user.cart = cart
          .filter((item) => item && item.product)
          .map((item) => ({
            product: String(item.product),
            quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
            size: item.size ? String(item.size) : '',
            color: item.color ? String(item.color) : '',
          }));
      }

      await user.save();

      return res.json({
        message: 'Profile updated successfully',
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/upload', authenticateToken, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'Image must be under 4 MB' : err.message });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old avatar file if it was a local upload
    if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', '..', user.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profileImage = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    return res.json({
      message: 'Profile image updated successfully',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/upload', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', user.profileImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    user.profileImage = '';
    await user.save();

    return res.json({ message: 'Profile image removed', user: sanitizeUser(user) });
  } catch (error) {
    console.error('Delete profile image error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// Wishlist Routes
// ==========================================

router.get('/wishlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/wishlist',
  authenticateToken,
  [body('productId').notEmpty().withMessage('Product ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0]?.msg || 'Invalid request',
          errors: errors.array(),
        });
      }

      const { productId } = req.body;
      const stringId = String(productId);

      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!user.wishlist) user.wishlist = [];

      if (user.wishlist.includes(stringId)) {
        return res.status(200).json({ message: 'Already in wishlist', wishlist: user.wishlist });
      }

      user.wishlist.push(stringId);
      await user.save();

      return res.status(201).json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.delete('/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const stringId = String(productId);

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist) user.wishlist = [];

    user.wishlist = user.wishlist.filter((id) => id !== stringId);
    await user.save();

    return res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

