const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportTicket = require('../models/SupportTicket');
const SupportMessage = require('../models/SupportMessage');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getSupportChatReply } = require('../services/supportChatService');

const router = express.Router();

router.post(
  '/chat',
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('sessionId').optional().isString().isLength({ min: 6, max: 120 }).withMessage('Invalid sessionId'),
    body('resetContext').optional().isBoolean().withMessage('resetContext must be boolean'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0]?.msg || 'Invalid request' });
      }

      const chatReply = await getSupportChatReply({
        message: req.body.message,
        sessionId: req.body.sessionId,
        resetContext: req.body.resetContext,
      });

      return res.status(200).json(chatReply);
    } catch (err) {
      console.error('Support AI chat error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create support message
router.post(
  '/messages',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('userId').optional().isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0]?.msg || 'Invalid request',
          errors: errors.array(),
        });
      }

      const { name, email, message, userId } = req.body;

      const supportMessage = await SupportMessage.create({
        name,
        email,
        message,
        userId: userId || null,
      });

      return res.status(201).json({
        message: 'Support message submitted successfully',
        supportMessage,
      });
    } catch (err) {
      console.error('Support message creation error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user.userId,
      subject,
      messages: [{ sender: 'user', text: message }],
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error('Support ticket creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add message
router.post('/:id/message', authenticateToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user.userId });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.messages.push({ sender: 'user', text: req.body.text });
    await ticket.save();

    res.json(ticket.messages[ticket.messages.length - 1]);
  } catch (err) {
    console.error('Support message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List tickets (for user)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Support list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
