const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/products').then(() => console.log('MongoDB connected')).catch(console.error);

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});

const Product = mongoose.model('Product', productSchema);

// GET: Fetch all products (initial full load - optional if you're using search)
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🔍 GET: Search products by name (partial, case-insensitive)
app.get('/api/products/search', async (req, res) => {
  const { name = '' } = req.query;
  const regex = new RegExp(name, 'i'); // case-insensitive
  const products = await Product.find({ name: regex });
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
