const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  category: String,
});

module.exports = mongoose.model('Product', productSchema);
