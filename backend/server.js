// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/db');
require('dotenv').config();

const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes Import
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const supportRoutes = require('./src/routes/supportRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Base Test Route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'RASU API Running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log('🟢 MongoDB connected');
    app.listen(PORT, () => console.log(`⚡ Backend running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('🔴 MongoDB connection failed:', err);
    process.exit(1);
  });
