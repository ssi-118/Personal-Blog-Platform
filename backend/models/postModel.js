const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  summary: {
    type: String,
    required: [true, 'Please provide a short summary'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide the blog content'],
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  readTime: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Auto-generate slug and read time before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (this.isModified('content')) {
    // Word count / 200 words per minute
    const words = this.content.trim().split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
