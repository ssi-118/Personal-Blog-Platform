const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  createComment,
  getAdminComments,
  approveComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/post/:postId', getCommentsByPost);
router.post('/', createComment);

// Admin-only routes
router.get('/admin', protect, getAdminComments);
router.put('/:id/approve', protect, approveComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
