const mongoose = require('mongoose');

const paymentLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    event: {
      type: String,
      required: true,
      enum: [
        'order_created',
        'payment_initiated',
        'payment_success',
        'payment_failed',
        'signature_verified',
        'signature_mismatch',
        'refund_initiated',
        'refund_completed',
        'webhook_received',
      ],
    },
    razorpayData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PaymentLog', paymentLogSchema);
