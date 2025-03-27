const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
  }
});

router.use('/uploads', express.static('uploads'));

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username firstName lastName')
      .populate('comments.user', 'username');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .populate('comments.user', 'username');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.id
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// New route: Edit user's own post
router.put('/:id/user', authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    console.log(`User edited blog ${req.params.id}`);
    res.json(blog);
  } catch (error) {
    console.error('Error editing blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// New route: Delete user's own post
router.delete('/:id/user', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    await Blog.deleteOne({ _id: req.params.id });
    console.log(`User deleted blog ${req.params.id}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (!blog.likes.includes(req.user.id)) {
      blog.likes.push(req.user.id);
      await blog.save();
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/:id/comment', authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.comments.push({ user: req.user.id, content });
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.post('/:id/share', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (!blog.shares.includes(req.user.id)) {
      blog.shares.push(req.user.id);
      await blog.save();
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Admin-only routes remain unchanged
router.put('/:id', adminMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    console.log(`Admin edited blog ${req.params.id}`);
    res.json(blog);
  } catch (error) {
    console.error('Error editing blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await Blog.deleteOne({ _id: req.params.id });
    console.log(`Admin deleted blog ${req.params.id}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;