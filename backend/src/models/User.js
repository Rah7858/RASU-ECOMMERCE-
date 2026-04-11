const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'],
    },
    passwordHash: { type: String, required: true },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCodeHash: String,
    emailVerificationExpiresAt: Date,
    verificationChannel: {
      type: String,
      enum: ['email', 'phone'],
      default: 'email',
    },
    profileImage: {
      type: String,
      default: '',
    },
    address: {
      addressLine: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    wishlist: [
      {
        type: String,
      },
    ],
    cart: [
      {
        product: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        size: { type: String, default: '' },
        color: { type: String, default: '' },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  { timestamps: true }
);

// either email or phone must be unique (if provided)
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
