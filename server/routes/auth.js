const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); // Ensure this is imported
const User = require('../models/User');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/register', async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;

  if (!username || !email || !firstName || !lastName || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const user = new User({ username, email, firstName, lastName, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ 
      token, 
      user: { id: user._id, username, email, firstName, lastName, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, isAdminLogin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (isAdminLogin && !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required for admin login' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log('Fetched users for admin:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log(`Invalid user ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      console.log(`User not found: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user and their blogs
    await User.deleteOne({ _id: req.params.id });
    const deletedBlogs = await Blog.deleteMany({ author: req.params.id });
    console.log(`Deleted user ${req.params.id} and ${deletedBlogs.deletedCount} posts`);
    
    res.json({ message: 'User and their posts deleted successfully' });
  } catch (error) {
    console.error('Detailed error deleting user:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      id: req.params.id
    });
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;