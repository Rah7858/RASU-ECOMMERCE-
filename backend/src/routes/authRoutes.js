const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const { isPhoneOtpConfigured, sendPhoneVerificationOtp } = require('../services/smsService');

const router = express.Router();

const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const getValidationMessage = (errors) => errors.array()[0]?.msg || 'Invalid request';

const maskPhone = (phone) => (phone ? `${phone.slice(0, 2)}******${phone.slice(-2)}` : '');

const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
};

const getDestinationValue = (channel, user) =>
  channel === 'phone' ? user.phone : user.email;

const getMaskedDestination = (channel, user) =>
  channel === 'phone' ? maskPhone(user.phone) : maskEmail(user.email);

const sendOtpByChannel = async (user, otp, channel) => {
  if (channel === 'phone') {
    if (!isPhoneOtpConfigured()) {
      throw new Error('Phone OTP is not configured on server yet. Please choose Email OTP.');
    }

    await sendPhoneVerificationOtp({
      toPhone: user.phone,
      otp,
    });
    return;
  }

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    otp,
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  emailVerified: user.emailVerified,
  verificationChannel: user.verificationChannel,
  profileImage: user.profileImage || '',
  address: user.address || {
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  },
  gender: user.gender || 'prefer_not_to_say',
  dateOfBirth: user.dateOfBirth || null,
  wishlist: user.wishlist || [],
  cart: user.cart || [],
});

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('phone').trim().matches(phoneRegex).withMessage('Enter a valid 10-digit mobile number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('otpChannel')
      .optional()
      .isIn(['email', 'phone'])
      .withMessage('otpChannel must be email or phone'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { name, email, phone, password, otpChannel = 'email' } = req.body;
      const lowerEmail = email?.toLowerCase().trim();
      const normalizedPhone = phone?.trim();

      const query = {
        $or: [
          ...(lowerEmail ? [{ email: lowerEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      };

      const existingUser = await User.findOne(query);
      if (existingUser) {
        if (existingUser.emailVerified) {
          return res.status(400).json({ message: 'Email or phone already registered' });
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const otp = createOtp();
      const emailVerificationCodeHash = hashOtp(otp);
      const emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      let user = existingUser;

      if (user) {
        user.name = name.trim();
        user.email = lowerEmail;
        user.phone = normalizedPhone;
        user.passwordHash = passwordHash;
        user.emailVerified = true; // Bypassed OTP
        user.emailVerificationCodeHash = emailVerificationCodeHash;
        user.emailVerificationExpiresAt = emailVerificationExpiresAt;
        user.verificationChannel = otpChannel;
        await user.save();
      } else {
        user = await User.create({
          name: name.trim(),
          email: lowerEmail,
          phone: normalizedPhone,
          passwordHash,
          emailVerified: true, // Bypassed OTP
          emailVerificationCodeHash,
          emailVerificationExpiresAt,
          verificationChannel: otpChannel,
        });
      }

      // OTP verification disabled for development
      // TODO: re-enable for production
      // await sendOtpByChannel(user, otp, otpChannel);
      //
      // return res.status(201).json({
      //   message:
      //     otpChannel === 'phone'
      //       ? 'Verification code sent to your phone'
      //       : 'Verification code sent to your email',
      //   channel: otpChannel,
      //   destination: getDestinationValue(otpChannel, user),
      //   maskedDestination: getMaskedDestination(otpChannel, user),
      //   requiresVerification: true,
      // });

      // Immediate JWT return (development bypass)
      const token = createToken({ userId: user._id, role: user.role });
      return res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ message: err.message || 'Server error' });
    }
  }
);

router.post(
  '/verify-otp',
  [
    body('channel').isIn(['email', 'phone']).withMessage('channel must be email or phone'),
    body('email')
      .if(body('channel').equals('email'))
      .trim()
      .isEmail()
      .withMessage('Enter a valid email address')
      .normalizeEmail(),
    body('phone')
      .if(body('channel').equals('phone'))
      .trim()
      .matches(phoneRegex)
      .withMessage('Enter a valid 10-digit mobile number'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit verification code'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { channel, email, phone, otp } = req.body;
      const filter =
        channel === 'phone'
          ? { phone: phone.trim() }
          : { email: email.toLowerCase().trim() };

      const user = await User.findOne(filter);

      if (!user) {
        return res.status(404).json({ message: 'Account not found' });
      }

      if (user.emailVerified) {
        const token = createToken({ userId: user._id, role: user.role });
        return res.status(200).json({ token, user: sanitizeUser(user) });
      }

      if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt || user.emailVerificationExpiresAt < new Date()) {
        return res.status(400).json({ message: 'Verification code expired. Request a new code.' });
      }

      if (hashOtp(otp.trim()) !== user.emailVerificationCodeHash) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }

      user.emailVerified = true;
      user.emailVerificationCodeHash = undefined;
      user.emailVerificationExpiresAt = undefined;
      user.verificationChannel = channel;
      await user.save();

      const token = createToken({ userId: user._id, role: user.role });
      return res.status(200).json({ token, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Verify email error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/resend-verification',
  [
    body('channel').isIn(['email', 'phone']).withMessage('channel must be email or phone'),
    body('email')
      .if(body('channel').equals('email'))
      .trim()
      .isEmail()
      .withMessage('Enter a valid email address')
      .normalizeEmail(),
    body('phone')
      .if(body('channel').equals('phone'))
      .trim()
      .matches(phoneRegex)
      .withMessage('Enter a valid 10-digit mobile number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { channel, email, phone } = req.body;

      const filter =
        channel === 'phone'
          ? { phone: phone.trim() }
          : { email: email.toLowerCase().trim() };

      const user = await User.findOne(filter);

      if (!user) {
        return res.status(404).json({ message: 'Account not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
      }

      const otp = createOtp();
      user.emailVerificationCodeHash = hashOtp(otp);
      user.emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      user.verificationChannel = channel;
      await user.save();

      await sendOtpByChannel(user, otp, channel);

      return res.status(200).json({
        message: 'Verification code resent successfully',
        channel,
        destination: getDestinationValue(channel, user),
        maskedDestination: getMaskedDestination(channel, user),
      });
    } catch (err) {
      console.error('Resend verification error:', err);
      return res.status(500).json({ message: err.message || 'Server error' });
    }
  }
);

router.post(
  '/login',
  [
    body('emailOrPhone')
      .trim()
      .notEmpty()
      .withMessage('Email or phone is required')
      .custom((value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = phoneRegex.test(value);

        if (!isEmail && !isPhone) {
          throw new Error('Enter a valid email address or 10-digit phone number');
        }

        return true;
      }),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { emailOrPhone, password } = req.body;
      const identifier = emailRegex.test(emailOrPhone.trim())
        ? emailOrPhone.trim().toLowerCase()
        : emailOrPhone.trim();

      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: 'Incorrect email/phone or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect email/phone or password' });
      }

      // OTP verification disabled for development
      // TODO: re-enable for production
      // if (!user.emailVerified) {
      //   return res.status(403).json({
      //     message:
      //       (user.verificationChannel || 'email') === 'phone'
      //         ? 'Verify your phone OTP before logging in'
      //         : 'Verify your email OTP before logging in',
      //     requiresVerification: true,
      //     email: user.email,
      //     phone: user.phone,
      //     channel: user.verificationChannel || 'email',
      //     maskedDestination: getMaskedDestination(user.verificationChannel || 'email', user),
      //   });
      // }

      // Auto-verify user if they log in during dev bypass
      if (!user.emailVerified) {
        user.emailVerified = true;
        await user.save();
      }

      const token = createToken({ userId: user._id, role: user.role });
      return res.status(200).json({ token, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/forgot-password',
  [
    body('emailOrPhone')
      .trim()
      .notEmpty()
      .withMessage('Email or phone is required')
      .custom((value) => {
        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error('Enter a valid email address or 10-digit phone number');
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { emailOrPhone } = req.body;
      const identifier = emailRegex.test(emailOrPhone.trim())
        ? emailOrPhone.trim().toLowerCase()
        : emailOrPhone.trim();

      const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

      if (!user) {
        return res.status(404).json({ message: 'No account found with this email or phone' });
      }

      const otp = createOtp();
      user.emailVerificationCodeHash = hashOtp(otp);
      user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      // OTP sending disabled for development
      // TODO: re-enable for production
      // await sendPasswordResetEmail({ to: user.email, name: user.name, otp });

      return res.status(200).json({
        message: 'Password reset code generated (Dev Mode).',
        maskedDestination: maskEmail(user.email),
        devOtp: otp, // Returned for local testing
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      return res.status(500).json({ message: err.message || 'Server error' });
    }
  }
);

router.post(
  '/reset-password',
  [
    body('emailOrPhone').trim().notEmpty().withMessage('Email or phone is required'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit reset code'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: getValidationMessage(errors), errors: errors.array() });
      }

      const { emailOrPhone, otp, newPassword } = req.body;
      const identifier = emailRegex.test(emailOrPhone.trim())
        ? emailOrPhone.trim().toLowerCase()
        : emailOrPhone.trim();

      const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

      if (!user) {
        return res.status(404).json({ message: 'Account not found' });
      }

      if (
        !user.emailVerificationCodeHash ||
        !user.emailVerificationExpiresAt ||
        user.emailVerificationExpiresAt < new Date()
      ) {
        return res.status(400).json({ message: 'Reset code has expired. Request a new one.' });
      }

      if (hashOtp(otp.trim()) !== user.emailVerificationCodeHash) {
        return res.status(400).json({ message: 'Invalid reset code' });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.emailVerificationCodeHash = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();

      return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
