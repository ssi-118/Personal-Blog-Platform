import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Search, SlidersHorizontal, BookOpen, Layers } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedTag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/posts?`;
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedTag) url += `tag=${encodeURIComponent(selectedTag)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);

        // Collect categories and tags dynamically from loaded posts on initial fetch if not filtering
        if (!selectedCategory && !selectedTag && !searchQuery) {
          const uniqueCategories = [...new Set(data.map(p => p.category))];
          setCategories(uniqueCategories);

          const allTags = data.reduce((acc, p) => [...acc, ...(p.tags || [])], []);
          setTags([...new Set(allTags)]);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
    // Clear and refetch
    setTimeout(() => {
      fetchPosts();
    }, 50);
  };

  return (
    <div className="container main-content animate-fade-in">
      {/* Hero Section */}
      <header className="glass-panel" style={{
        padding: '3rem 2rem',
        borderRadius: '24px',
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'var(--primary-glow)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'var(--accent-glow)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-color)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            👨‍💻
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }} className="gradient-text">
            Welcome to my Blog
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Sharing insights, tutorials, and thoughts on technology, software engineering, and digital craft.
          </p>

          {/* Social Links / Details */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>✍️ Writer & Creator</span>
            <span>•</span>
            <span>✉️ contact@example.com</span>
            <span>•</span>
            <span>🚀 Insights & Ideas</span>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="glass-panel animate-fade-in" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, maxWidth: '450px', width: '100%' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', margin: 0 }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>Search</button>
        </form>

        {/* Categories / Tags filter dropdowns */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={14} style={{ color: 'var(--text-secondary)' }} />
            <select 
              className="form-input" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.75rem', fontSize: '0.875rem', margin: 0 }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Reset button if filters active */}
          {(selectedCategory || selectedTag || searchQuery) && (
            <button onClick={handleResetFilters} className="btn btn-secondary btn-small" style={{ fontSize: '0.8rem' }}>
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Grid of posts */}
      <main>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            borderRadius: '16px',
            border: '2px dashed var(--border-color)',
            color: 'var(--text-secondary)'
          }}>
            <BookOpen size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
            <h3>No articles found</h3>
            <p style={{ marginTop: '0.5rem' }}>We couldn't find any posts matching your criteria. Try adjusting your filters or search terms.</p>
            {(selectedCategory || selectedTag || searchQuery) && (
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {posts.map((post) => (
              <div key={post._id} style={{ display: 'flex' }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
