const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const PaymentLog = require('../models/PaymentLog');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '';
}

router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city) {
      return res.status(400).json({ message: 'Valid shipping address is required' });
    }

    let totalAmount = 0;
    const validatedItems = items.map((item) => {
      const price = Math.round(Number(item.price) * 100) / 100;
      const quantity = Math.max(1, Math.floor(Number(item.quantity)));

      if (price <= 0 || !item.name) {
        throw new Error(`Invalid item: ${item.name || 'unknown'}`);
      }

      totalAmount += price * quantity;

      return {
        productId: item.productId || undefined,
        name: String(item.name).slice(0, 200),
        image: item.image ? String(item.image).slice(0, 500) : '',
        price,
        quantity,
        size: item.size ? String(item.size).slice(0, 10) : '',
        color: item.color ? String(item.color).slice(0, 20) : '',
      };
    });

    totalAmount = Math.round(totalAmount * 100) / 100;
    const amountInPaise = Math.round(totalAmount * 100);

    const order = await Order.create({
      userId: req.user.userId,
      items: validatedItems,
      shippingAddress,
      phone: phone ? String(phone).slice(0, 15) : '',
      totalAmount,
      paymentMethod: 'RAZORPAY',
      status: 'Pending',
      paymentStatus: 'PENDING',
      statusHistory: [
        {
          status: 'Order Created',
          description: 'Order placed, awaiting payment',
          timestamp: new Date(),
        },
      ],
    });

    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString(),
        userId: req.user.userId,
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    await Payment.create({
      orderId: order._id,
      userId: req.user.userId,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      status: 'created',
    });

    await PaymentLog.create({
      orderId: order._id,
      event: 'order_created',
      razorpayData: { razorpayOrderId: razorpayOrder.id, amount: amountInPaise },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
    });

    return res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
});

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    const existingPayment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      status: 'paid',
    });
    if (existingPayment) {
      return res.status(200).json({
        verified: true,
        message: 'Payment already verified',
        orderId: existingPayment.orderId,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!isValid) {
      await PaymentLog.create({
        orderId: order._id,
        event: 'signature_mismatch',
        razorpayData: { razorpay_order_id, razorpay_payment_id },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
      });

      order.paymentStatus = 'FAILED';
      order.status = 'Cancelled';
      order.statusHistory.push({
        status: 'Payment Failed',
        description: 'Payment signature verification failed',
        timestamp: new Date(),
      });
      await order.save();

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );

      return res.status(400).json({ verified: false, message: 'Payment verification failed' });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = 'PAID';
    order.status = 'Confirmed';
    order.statusHistory.push({
      status: 'Payment Verified',
      description: `Payment of ₹${order.totalAmount} received via Razorpay`,
      timestamp: new Date(),
    });
    await order.save();

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid',
      }
    );

    await PaymentLog.create({
      orderId: order._id,
      event: 'signature_verified',
      razorpayData: { razorpay_order_id, razorpay_payment_id },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'] || '',
    });

    return res.status(200).json({
      verified: true,
      message: 'Payment verified successfully',
      orderId: order._id,
      amount: order.totalAmount,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
