import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { ArrowLeft, Save, Eye, Edit3, HelpCircle } from 'lucide-react';

// Reusable Markdown parser (simple version)
const parseMarkdown = (markdown = '') => {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 style="font-size:1.2rem; margin:1rem 0 0.5rem 0; font-weight:700;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:1.4rem; margin:1.5rem 0 0.75rem 0; font-weight:700; border-bottom:1px solid var(--border-color); padding-bottom:0.3rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:1.8rem; margin:1.5rem 0 0.75rem 0; font-weight:800;">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid var(--primary); padding-left:1rem; margin:1rem 0; color:var(--text-secondary); font-style:italic;">$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left:1.25rem; margin-bottom:0.25rem;">$1</li>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left:1.25rem; margin-bottom:0.25rem;">$1</li>')
    .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre style="background:var(--code-bg); border:1px solid var(--border-color); padding:0.75rem; border-radius:var(--radius-sm); overflow-x:auto; margin:1rem 0; font-family:var(--font-mono); font-size:0.85rem;"><code>$1</code></pre>')
    .replace(/\`([^`]+)\`/g, '<code style="background:var(--code-bg); border:1px solid var(--border-color); padding:0.1rem 0.3rem; border-radius:4px; font-family:var(--font-mono); font-size:0.85rem;">$1</code>')
    .replace(/\n$/gim, '<br />');

  const paragraphs = html.split(/\n\n/);
  return paragraphs.map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<blockquote') || p.trim().startsWith('<li') || p.trim() === '') {
      return p;
    }
    return `<p style="line-height:1.6; margin-bottom:1rem; font-size:0.95rem; color:var(--text-secondary);">${p}</p>`;
  }).join('\n');
};

const PostEditor = () => {
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // populated if editing
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataFetching, setDataFetching] = useState(isEditMode);
  const [previewMode, setPreviewMode] = useState(false); // splits screen or switches

  // Protect Route
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      fetchPost();
    }
  }, [user, id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        headers: getAuthHeader()
      });

      if (!res.ok) {
        throw new Error('Post not found');
      }

      const data = await res.json();
      setTitle(data.title);
      setCategory(data.category);
      setSummary(data.summary);
      setCoverImage(data.coverImage || '');
      setTagsInput(data.tags ? data.tags.join(', ') : '');
      setStatus(data.status);
      setContent(data.content);
    } catch (error) {
      console.error(error);
      alert('Failed to load post data');
      navigate('/admin');
    } finally {
      setDataFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content || !category) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    const postData = {
      title,
      category,
      summary,
      coverImage,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      status,
      content
    };

    try {
      const url = isEditMode ? `${API_BASE_URL}/posts/${id}` : `${API_BASE_URL}/posts`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        navigate('/admin');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error saving post');
      }
    } catch (error) {
      console.error(error);
      alert('Network error while saving post');
    } finally {
      setLoading(false);
    }
  };

  if (dataFetching) {
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

  return (
    <div className="container main-content animate-fade-in" style={{ maxWidth: '1100px' }}>
      {/* Header controls */}
      <header style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary btn-small" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isEditMode ? 'Edit Article' : 'Write New Article'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            onClick={() => setPreviewMode(!previewMode)} 
            className="btn btn-secondary"
            style={{ display: 'flex', gap: '0.4rem' }}
          >
            {previewMode ? <Edit3 size={16} /> : <Eye size={16} />}
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="btn btn-primary"
            style={{ display: 'flex', gap: '0.4rem' }}
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </header>

      {/* Main Form Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Title */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Article Title *</label>
            <input 
              type="text" 
              required
              className="form-input" 
              placeholder="e.g. Mastering Async/Await in Node.js" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select 
              className="form-input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Programming">Programming</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Career">Career</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. javascript, backend, express" 
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Cover Image URL */}
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="https://images.unsplash.com/... or blank" 
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Publishing Status *</label>
            <select 
              className="form-input" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>

          {/* Summary */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Short Summary *</label>
            <input 
              type="text" 
              required
              maxLength={200}
              className="form-input" 
              placeholder="Provide a brief summary for the card feed (max 200 chars)" 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <section className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {/* Editor Title Bar */}
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✍️ Content Editor (Markdown Supported)
          </span>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <HelpCircle size={14} /> Use standard markdown like #, ##, **, -, etc.
          </span>
        </div>

        {/* Editor Split Pane */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: previewMode ? '1fr' : '1fr 1fr',
          height: '500px',
          alignItems: 'stretch'
        }}>
          {/* Editor Input Column (hidden in full preview mode) */}
          <textarea
            required
            placeholder="# Write your article here...&#10;&#10;## Section Title&#10;Write details. Use code blocks like:&#10;\`\`\`javascript&#10;console.log('hello world');&#10;\`\`\`"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              padding: '1.25rem',
              border: 'none',
              borderRight: previewMode ? 'none' : '1px solid var(--border-color)',
              resize: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              display: previewMode ? 'none' : 'block'
            }}
          ></textarea>

          {/* Preview Output Column */}
          <div style={{
            padding: '1.25rem',
            overflowY: 'auto',
            background: previewMode ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
            lineHeight: 1.8
          }}>
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Markdown preview will render here...</p>
            )}
          </div>
        </div>
      </section>

      {/* Editor CSS layout responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          section > div {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          textarea {
            height: 300px;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color);
          }
          div[style*="overflowY: 'auto'"] {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default PostEditor;
