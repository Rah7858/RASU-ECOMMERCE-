const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    messages: [
      {
        sender: { type: String, enum: ['user', 'support', 'bot'], default: 'user' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SupportTicket', ticketSchema);
