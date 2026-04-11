const axios = require('axios');

async function generateProductImage(prompt, productId) {
  const res = await axios.post('http://localhost:8000/generate-image', {
    prompt,
    product_id: productId,
  });
  return res.data.image_url;
}

module.exports = { generateProductImage };
