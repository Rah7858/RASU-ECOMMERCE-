#!/usr/bin/env node

/**
 * Promote a user to admin role.
 * Usage: node scripts/makeAdmin.js <email>
 * Example: node scripts/makeAdmin.js rahul.work1017@gmail.com
 */

const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../src/models/User');

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User ${email} is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted ${user.name} (${email}) to admin.`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
