import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { Calendar, Clock, Eye, ArrowLeft, Layers, BookOpen } from 'lucide-react';

// A simple Markdown parser function that handles basic headers, bold, list items, and code blocks
const parseMarkdown = (markdown = '') => {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 id="$1" style="font-size:1.3rem; margin:1.5rem 0 1rem 0; font-weight:700;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="$1" style="font-size:1.6rem; margin:2rem 0 1rem 0; font-weight:700; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:2rem; margin:2rem 0 1rem 0; font-weight:800;">$1</h1>')
    
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid var(--primary); padding-left:1rem; margin:1.5rem 0; color:var(--text-secondary); font-style:italic;">$1</blockquote>')
    
    // Lists
    .replace(/^\- (.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; list-style-type:disc;">$1</li>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.5rem; list-style-type:disc;">$1</li>')
    
    // Code blocks
    .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre style="background:var(--code-bg); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-sm); overflow-x:auto; margin:1.5rem 0; font-family:var(--font-mono); font-size:0.9rem; line-height:1.5;"><code>$1</code></pre>')
    
    // Inline code
    .replace(/\`([^`]+)\`/g, '<code style="background:var(--code-bg); border:1px solid var(--border-color); padding:0.2rem 0.4rem; border-radius:4px; font-family:var(--font-mono); font-size:0.9rem;">$1</code>')
    
    // Line breaks
    .replace(/\n$/gim, '<br />');

  // Wrap lists
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul style="margin:1rem 0;">$1</ul>');

  // Wrap paragraphs (split by double newlines)
  const paragraphs = html.split(/\r?\n\r?\n/);
  return paragraphs.map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<blockquote') || p.trim().startsWith('<ul') || p.trim().startsWith('<li') || p.trim() === '') {
      return p;
    }
    return `<p style="line-height:1.8; margin-bottom:1.25rem; font-size:1.05rem; color:var(--text-secondary);">${p}</p>`;
  }).join('\n');
};

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/slug/${slug}`);
        if (!res.ok) {
          throw new Error('Article not found');
        }
        const data = await res.json();
        setPost(data);
        
        // Extract headings for Table of Contents
        const headingRegex = /^## (.*$)/gim;
        const matches = [];
        let match;
        while ((match = headingRegex.exec(data.content)) !== null) {
          matches.push(match[1]);
        }
        setHeadings(matches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container main-content" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container main-content animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Back Button */}
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        marginBottom: '2rem',
        fontWeight: 500
      }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = ''}
      >
        <ArrowLeft size={18} /> Back to Articles
      </Link>

      {/* Article Header */}
      <header style={{ marginBottom: '2rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          {post.category}
        </span>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          lineHeight: 1.25,
          marginBottom: '1rem',
          fontFamily: 'var(--font-headings)'
        }}>
          {post.title}
        </h1>

        {/* Metadata */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} />
            {formattedDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} />
            {post.readTime} min read
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} />
            {post.views} views
          </span>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div style={{
          width: '100%',
          maxHeight: '450px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <img 
            src={post.coverImage} 
            alt={post.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content Layout with Table of Contents sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: headings.length > 0 ? '1fr 240px' : '1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Article Body */}
        <article style={{ overflow: 'hidden' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} 
            style={{ 
              color: 'var(--text-primary)',
              lineHeight: 1.8,
              fontSize: '1.08rem'
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              {post.tags.map(tag => (
                <span key={tag} className="badge" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <CommentSection postId={post._id} />
        </article>

        {/* Sidebar Table of Contents */}
        {headings.length > 0 && (
          <aside className="glass-panel" style={{
            position: 'sticky',
            top: '100px',
            padding: '1.25rem',
            borderRadius: '12px',
            display: 'none', // Hidden on mobile, shown on desktop
            fontSize: '0.875rem'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <BookOpen size={16} />
              On This Page
            </h4>
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)' }}>
              {headings.map((heading) => (
                <li key={heading}>
                  <a 
                    href={`#${heading}`} 
                    style={{
                      display: 'block',
                      transition: 'color var(--transition-fast)',
                      lineHeight: 1.3
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = ''}
                  >
                    {heading}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* Sidebar Responsive styles hack */}
      <style>{`
        @media (min-width: 768px) {
          aside { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default PostDetail;
