const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

// @desc    Get all approved comments for a specific post (Public)
// @route   GET /api/comments/post/:postId
// @access  Public
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      isApproved: true,
    }).sort({ createdAt: 1 }); // Oldest first for readability/thread structure

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a comment (Public)
// @route   POST /api/comments
// @access  Public
const createComment = async (req, res) => {
  try {
    const { postId, name, email, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: postId,
      name,
      email,
      content,
      isApproved: false, // Default is pending moderation
    });

    res.status(201).json({
      message: 'Comment submitted. It will be visible after admin approval.',
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments (Admin)
// @route   GET /api/comments/admin
// @access  Private (Admin)
const getAdminComments = async (req, res) => {
  try {
    // Populate the post title so admin knows which post it belongs to
    const comments = await Comment.find({})
      .populate('post', 'title slug')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a comment (Admin)
// @route   PUT /api/comments/:id/approve
// @access  Private (Admin)
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isApproved = true;
    await comment.save();

    res.json({ message: 'Comment approved successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment (Admin)
// @route   DELETE /api/comments/:id
// @access  Private (Admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  getAdminComments,
  approveComment,
  deleteComment,
};
