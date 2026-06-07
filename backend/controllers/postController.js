const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

// @desc    Get all published posts (Public)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = { status: 'published' };

    if (category) {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }

    if (tag) {
      query.tags = { $regex: new RegExp('^' + tag + '$', 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by slug (Public)
// @route   GET /api/posts/slug/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts including drafts (Admin)
// @route   GET /api/posts/admin
// @access  Private (Admin)
const getAdminPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID (Admin)
// @route   GET /api/posts/:id
// @access  Private (Admin)
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Admin)
const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, tags, coverImage, status } = req.body;

    const post = await Post.create({
      title,
      summary,
      content,
      category,
      tags: tags || [],
      coverImage: coverImage || '',
      status: status || 'draft',
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Admin)
const updatePost = async (req, res) => {
  try {
    const { title, summary, content, category, tags, coverImage, status } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.status = status || post.status;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete comments associated with the post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await post.deleteOne();

    res.json({ message: 'Post and associated comments removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics stats
// @route   GET /api/posts/stats/dashboard
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    
    // Aggregation for total views
    const viewsData = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

    // Categories breakdown
    const categoriesData = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Latest posts
    const latestPosts = await Post.find({}).sort({ createdAt: -1 }).limit(5).select('title views status createdAt');

    res.json({
      totalPosts,
      totalComments,
      totalViews,
      categories: categoriesData,
      latestPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  getAdminPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getStats,
};
