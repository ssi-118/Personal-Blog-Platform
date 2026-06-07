import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ChevronRight } from 'lucide-react';

// Generates a beautiful gradient based on the post ID or title string length
const getDynamicGradient = (seedString) => {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
  ];
  const index = seedString ? seedString.length % gradients.length : 0;
  return gradients[index];
};

const PostCard = ({ post }) => {
  const { title, slug, summary, category, coverImage, views, readTime, createdAt } = post;
  
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      padding: 0,
    }}>
      {/* Cover Image or Dynamic Gradient */}
      <Link to={`/post/${slug}`} style={{ display: 'block', position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={title} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-normal)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Generative Gradient Cover (as primary if no image, or as fallback) */}
        <div style={{
          display: coverImage ? 'none' : 'flex',
          width: '100%',
          height: '100%',
          background: getDynamicGradient(title),
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1.25rem',
          textAlign: 'center',
          lineHeight: 1.4,
          fontFamily: 'var(--font-headings)'
        }}>
          {title.length > 50 ? `${title.slice(0, 50)}...` : title}
        </div>

        {/* Category Badge overlay */}
        <span className="badge badge-primary" style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          {category}
        </span>
      </Link>

      {/* Body Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Meta row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} />
            {formattedDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {readTime} min read
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Eye size={12} />
            {views}
          </span>
        </div>

        {/* Title */}
        <Link to={`/post/${slug}`}>
          <h3 style={{
            fontSize: '1.2rem',
            marginBottom: '0.75rem',
            lineHeight: 1.4,
            fontWeight: 700,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = ''}
          >
            {title}
          </h3>
        </Link>

        {/* Summary */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginBottom: '1.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          flexGrow: 1
        }}>
          {summary}
        </p>

        {/* Read More button */}
        <Link to={`/post/${slug}`} className="gradient-text" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginTop: 'auto',
          alignSelf: 'flex-start'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
        >
          Read Article <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
