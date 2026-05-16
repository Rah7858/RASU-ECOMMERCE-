const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    category: { type: String, required: true },
    subcategory: String,
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    ageGroup: { type: String, default: 'adult' },
    occasion: { type: String, default: 'casual' },
    image: String,
    images: [String],
    sizes: [String],
    colors: [String],
    stock: { type: Number, default: 50 },
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    brand: { type: String, default: 'RASU' },
    aiImageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
