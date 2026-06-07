const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  getAdminPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getStats,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);

// Admin-only routes
router.get('/admin', protect, getAdminPosts);
router.get('/stats/dashboard', protect, getStats);
router.get('/:id', protect, getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
