const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

// Food Management

// Get all food items (including unavailable)
router.get('/foods', adminAuth, async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create food item
router.post('/foods', adminAuth, async (req, res) => {
  try {
    const { name, description, price, image, category, available } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Please provide name, description, and price' });
    }

    const food = new Food({
      name,
      description,
      price,
      image: image || 'https://via.placeholder.com/300x200?text=Food+Item',
      category: category || 'General',
      available: available !== undefined ? available : true
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update food item
router.put('/foods/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete food item
router.delete('/foods/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order Management

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.food')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.food').populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

