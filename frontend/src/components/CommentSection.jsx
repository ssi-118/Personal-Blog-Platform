import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../context/AuthContext';
import { Send, User, Calendar } from 'lucide-react';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !content) return;
    
    setLoading(true);
    setSubmitMessage(null);
    setIsError(false);

    try {
      const res = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          name,
          email,
          content
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setName('');
        setEmail('');
        setContent('');
        setSubmitMessage('Your comment has been submitted and is pending moderation!');
      } else {
        setIsError(true);
        setSubmitMessage(data.message || 'Error submitting comment. Please try again.');
      }
    } catch (error) {
      setIsError(true);
      setSubmitMessage('Network error. Please try again.');
      console.error('Comment submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Join the discussion</h4>
        
        {submitMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: isError ? 'var(--error)' : 'var(--success)',
            border: `1px solid ${isError ? 'var(--error)' : 'var(--success)'}`
          }}>
            {submitMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Name</label>
            <input 
              type="text" 
              required
              className="form-input" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <input 
              type="email" 
              required
              className="form-input" 
              placeholder="your@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Comment</label>
          <textarea 
            required
            rows="4" 
            className="form-input" 
            placeholder="Type your thoughts..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          <Send size={16} />
          {loading ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-glow)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={16} />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{comment.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={10} />
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line', paddingLeft: '2.5rem' }}>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
