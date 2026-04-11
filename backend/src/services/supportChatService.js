const Product = require('../models/Product');

const END_MESSAGE =
  "Thank you for visiting RASU Site. Hope you are satisfied with the service. I recommend you refer this site to your friends and family members. Thank you so much. Lots of love from Team RASU.";

const chatSessionMemory = new Map();

const categorySignals = {
  clothing: ['dress', 'shirt', 't-shirt', 'tops', 'kurti', 'jeans', 'clothes', 'outfit', 'wear'],
  accessories: ['accessory', 'accessories', 'ring', 'pendant', 'belt', 'cap', 'watch', 'glasses'],
};

const includesAny = (text, words) => words.some((word) => text.includes(word));

const inferGender = (text) => {
  if (includesAny(text, ['women', 'woman', 'ladies', 'female', 'girl'])) return 'women';
  if (includesAny(text, ['men', 'man', 'male', 'boy'])) return 'men';
  return null;
};

const inferCategory = (text) => {
  if (includesAny(text, categorySignals.accessories)) return 'accessories';
  if (includesAny(text, categorySignals.clothing)) return 'clothing';
  return null;
};

const extractBudget = (text) => {
  const match = text.match(/(?:under|below|less than|budget)\s*\D*(\d{2,6})/i);
  return match ? Number(match[1]) : null;
};

const isGreeting = (text) =>
  includesAny(text, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']);

const buildNoMatchReply = (requestedCategory, requestedGender, budget, text) => {
  if (requestedGender && budget) {
    return `I could not find exact ${requestedGender} items under INR ${budget} right now. Try INR ${budget + 500} or ask for ${requestedGender} accessories.`;
  }

  if (requestedGender && requestedCategory) {
    return `I could not find exact ${requestedGender} ${requestedCategory} right now. Try asking for ${requestedGender} options under a budget, like: "${requestedGender} under 2000".`;
  }

  if (requestedGender) {
    return `Sure, I can help with ${requestedGender} collection. You can refine by saying: "${requestedGender} dress under 1500" or "${requestedGender} accessories under 2000".`;
  }

  if (requestedCategory === 'accessories') {
    return 'For accessories, I can help with watch, glasses, belt, cap, ring, and pendant. Tell me your budget for best picks.';
  }

  if (requestedCategory === 'clothing') {
    return 'For clothing, I can suggest shirts, dresses, tops, jeans, and casual wear. Tell me men/women and your budget for better results.';
  }

  if (budget) {
    return `I can help with options under INR ${budget}. Tell me men/women or dress/accessories to narrow the best picks.`;
  }

  if (text.length <= 4) {
    return 'Please share a bit more detail, for example: men under 1500, women dress, or accessories under 2000.';
  }

  return 'I can help you quickly if you include filters like men/women, dress/accessories, and budget (example: women dress under 2000).';
};

const buildProductReply = (products, requestedCategory, requestedGender, budget) => {
  if (!products.length) {
    return buildNoMatchReply(requestedCategory, requestedGender, budget, '');
  }

  const headingParts = [];
  if (requestedGender) headingParts.push(requestedGender);
  if (requestedCategory) headingParts.push(requestedCategory);
  if (budget) headingParts.push(`under INR ${budget}`);

  const heading = headingParts.length
    ? `Here are the best ${headingParts.join(' ')} options I found:`
    : 'Here are some great options I found for you:';

  const list = products.map((product) => `- ${product.name} (INR ${product.price})`).join('\n');

  return `${heading}\n${list}\nYou can ask me to narrow by occasion, budget, or category.`;
};

async function getSupportChatReply({ message, sessionId, resetContext }) {
  const text = message.toLowerCase().trim();
  const resolvedSessionId = String(sessionId || `session_${Date.now()}`);

  if (resetContext) {
    chatSessionMemory.delete(resolvedSessionId);
  }

  const previousContext = chatSessionMemory.get(resolvedSessionId) || {
    gender: null,
    category: null,
    budget: null,
  };

  if (includesAny(text, ['thanks', 'thank you', 'satisfied', 'resolved', 'done', 'bye'])) {
    chatSessionMemory.delete(resolvedSessionId);
    return { reply: END_MESSAGE, endConversation: true };
  }

  if (isGreeting(text)) {
    return {
      reply:
        'Hello. Welcome to RASU support. I can help with dresses, accessories, budgets, order tracking, returns, and payments. Tell me what you need.',
      endConversation: false,
    };
  }

  if (includesAny(text, ['order', 'track', 'delivery'])) {
    return {
      reply:
        'For order tracking, please open Order History in your profile and select the order. If needed, I can help you with cancellation and return guidance too.',
      endConversation: false,
    };
  }

  if (includesAny(text, ['return', 'refund', 'exchange'])) {
    return {
      reply:
        'For returns or refunds, share your order ID and reason. Our support team usually responds within 2-4 hours and will guide the next steps quickly.',
      endConversation: false,
    };
  }

  if (includesAny(text, ['payment', 'upi', 'card', 'cod', 'failed payment'])) {
    return {
      reply: 'For payment help, please share your order ID and payment mode (UPI/Card/COD). We will verify and assist immediately.',
      endConversation: false,
    };
  }

  const explicitCategory = inferCategory(text);
  const explicitGender = inferGender(text);
  const explicitBudget = extractBudget(text);

  const requestedCategory = explicitCategory || previousContext.category;
  const requestedGender = explicitGender || previousContext.gender;
  const budget = explicitBudget || previousContext.budget;

  chatSessionMemory.set(resolvedSessionId, {
    category: requestedCategory,
    gender: requestedGender,
    budget,
  });

  const query = { isActive: true };
  if (requestedGender) query.gender = requestedGender;

  if (requestedCategory === 'accessories') {
    query.category = { $in: ['watch', 'glasses', 'belt', 'cap', 'ring', 'pendant'] };
  } else if (requestedCategory === 'clothing') {
    query.category = { $in: ['clothing', 'shorts', 'undergarment'] };
  }

  if (budget) query.price = { $lte: budget };

  let products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name price category gender occasion');

  if (!products.length) {
    products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price category gender occasion');

    if (!products.length) {
      return {
        reply: buildNoMatchReply(requestedCategory, requestedGender, budget, text),
        endConversation: false,
      };
    }
  }

  return {
    reply: buildProductReply(products, requestedCategory, requestedGender, budget),
    endConversation: false,
    context: {
      category: requestedCategory,
      gender: requestedGender,
      budget,
    },
  };
}

module.exports = {
  getSupportChatReply,
};
