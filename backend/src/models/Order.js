const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: String,
  color: String,
});

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "system" },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    phone: String,
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY", "UPI"],
      default: "COD",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    carrierName: {
      type: String,
      default: "",
    },
    estimatedDelivery: {
      type: Date,
    },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);

