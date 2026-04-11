// backend/src/routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * CREATE ORDER (Checkout)
 * This is called after user completes checkout form
 */
router.post('/', authenticateToken, async (req, res) => {
  const { items, shippingAddress, phone, paymentMethod, totalAmount } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    const order = await Order.create({
      userId: req.user.userId,
      items,
      shippingAddress,
      phone,
      paymentMethod,
      totalAmount,
      status: 'Pending',
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { orders: order._id },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

/**
 * GET ORDERS FOR A USER
 * /api/orders/user/:userId
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Cannot fetch orders' });
  }
});

/**
 * GET SINGLE ORDER DETAILS
 * /api/orders/:orderId
 */
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details' });
  }
});

/**
 * UPDATE ORDER STATUS (for admin panel later)
 * /api/orders/status/:orderId
 */
router.put('/status/:orderId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;
