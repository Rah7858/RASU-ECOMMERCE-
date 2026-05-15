const express = require('express');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');

const router = express.Router();

router.use(adminMiddleware);

router.get('/dashboard/stats', async (_req, res) => {
  try {
    const [totalOrders, totalUsers, revenueResult, paidOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ paymentStatus: 'PAID' }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const avgOrderValue = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

    return res.json({
      totalOrders,
      totalUsers,
      totalRevenue,
      avgOrderValue,
      paidOrders,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard/revenue-chart', async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const data = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const found = data.find((item) => item._id === key);
      days.push({
        date: key,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0,
      });
    }

    return res.json(days);
  } catch (error) {
    console.error('Revenue chart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard/orders-by-status', async (_req, res) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return res.json(data.map((d) => ({ status: d._id, count: d.count })));
  } catch (error) {
    console.error('Orders by status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard/recent-orders', async (_req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .select('status totalAmount paymentStatus createdAt items');

    return res.json(orders);
  } catch (error) {
    console.error('Recent orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email phone'),
      Order.countDocuments(filter),
    ]);

    return res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'name email phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.json(order);
  } catch (error) {
    console.error('Get order detail error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { status, description, location } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({
      status,
      description: description || `Status updated to ${status}`,
      location: location || '',
      timestamp: new Date(),
      updatedBy: 'admin',
    });

    if (status === 'Delivered') {
      order.paymentStatus = order.paymentMethod === 'COD' ? 'PAID' : order.paymentStatus;
    }

    await order.save();

    return res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -emailVerificationCodeHash -emailVerificationExpiresAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:userId/ban', async (req, res) => {
  try {
    const { banned } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !!banned;
    await user.save();

    return res.json({
      message: banned ? 'User banned' : 'User unbanned',
      user: { id: user._id, name: user.name, email: user.email, isBanned: user.isBanned },
    });
  } catch (error) {
    console.error('Ban user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:userId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .select('status totalAmount paymentStatus createdAt items');

    return res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
