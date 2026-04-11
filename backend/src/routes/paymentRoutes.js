const express = require('express');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id'
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

router.post('/order', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    await Payment.create({
      user: req.user.userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
      status: 'created',
    });

    return res.status(201).json({ order: razorpayOrder });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    return res.status(500).json({ message: 'Failed to create payment order' });
  }
});

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification fields are required' });
    }

    const generatedSignature = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, status: 'paid' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    return res.status(200).json({ message: 'Payment verified successfully' });
  } catch (err) {
    console.error('Razorpay verification failed:', err);
    return res.status(500).json({ message: 'Failed to verify payment' });
  }
});

module.exports = router;
