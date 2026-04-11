const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: [
        'clothing',
        'perfume',
        'watch',
        'glasses',
        'belt',
        'cap',
        'shorts',
        'undergarment',
        'ring',
        'pendant',
      ],
      required: true,
    },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    ageGroup: { type: String, enum: ['kids', 'teen', 'adult', 'senior'], required: true },
    occasion: {
      type: String,
      enum: ['casual', 'formal', 'party', 'wedding', 'festive', 'sports'],
      required: true,
    },
    image: String,
    aiImageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
