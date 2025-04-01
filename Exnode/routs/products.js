const express = require('express');
const router = express.Router();
const data = require('../data');

// Helper to find product by ID
const findProduct = (id) => data.products.find(p => p.id === parseInt(id));

// GET /api/products
router.get('/', (req, res) => {
  res.json(data.products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products
router.post('/', (req, res) => {
  const { id, name, price, stock } = req.body;

  if (data.products.find(p => p.id === id)) {
    return res.status(400).json({ message: 'Product ID already exists' });
  }

  if (!name || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Invalid product data (name, price)' });
  }

  const newProduct = { id, name, price };
  if (stock !== undefined) {
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }
    newProduct.stock = stock;
  }

  data.products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, stock } = req.body;

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return res.status(400).json({ message: 'Invalid price value' });
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ message: 'Invalid stock value' });
  }

  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json(product);
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const index = data.products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deleted = data.products.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
