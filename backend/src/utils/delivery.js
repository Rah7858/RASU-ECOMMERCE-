// backend/src/utils/delivery.js
function estimateDeliveryDate(orderDate = new Date(), state) {
  const d = new Date(orderDate);
  const daysToAdd = state && state.toLowerCase() === 'jharkhand' ? 3 : 6;
  d.setDate(d.getDate() + daysToAdd);
  return d;
}

module.exports = { estimateDeliveryDate };
