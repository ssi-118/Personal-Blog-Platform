import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { 
  BarChart3, FileText, MessageSquare, Eye, Plus, 
  Trash2, Edit, Check, X, ShieldAlert, CornerDownRight 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'comments'
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { ...getAuthHeader() };

      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/posts/stats/dashboard`, { headers });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch all posts (including drafts)
      const postsRes = await fetch(`${API_BASE_URL}/posts/admin`, { headers });
      const postsData = await postsRes.json();
      setPosts(postsData);

      // Fetch all comments
      const commentsRes = await fetch(`${API_BASE_URL}/comments/admin`, { headers });
      const commentsData = await commentsRes.json();
      setComments(commentsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post and all its comments? This action is permanent.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId));
        // Refresh stats
        fetchDashboardData();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}/approve`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });

      if (res.ok) {
        setComments(comments.map(c => c._id === commentId ? { ...c, isApproved: true } : c));
        // Refresh stats
        fetchDashboardData();
      } else {
        alert('Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
        // Refresh stats
        fetchDashboardData();
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading || !stats) {
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
    <div className="container main-content animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome back, {user.username || 'Admin'}. Manage your content here.
          </p>
        </div>
        <Link to="/admin/write" className="btn btn-primary" style={{ display: 'flex', gap: '0.4rem' }}>
          <Plus size={18} />
          Create Post
        </Link>
      </header>

      {/* Analytics Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-glow)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Posts</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.1rem' }}>{stats.totalPosts}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Eye size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Views</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.1rem' }}>{stats.totalViews}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Comments</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.1rem' }}>{stats.totalComments}</h3>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.05rem',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            color: activeTab === 'posts' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'posts' ? '2px solid var(--primary)' : 'none',
            outline: 'none'
          }}
        >
          Posts ({posts.length})
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.05rem',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            color: activeTab === 'comments' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : 'none',
            outline: 'none'
          }}
        >
          Comments ({comments.length})
        </button>
      </section>

      {/* Tab Panels */}
      <main>
        {activeTab === 'posts' ? (
          /* Posts Table */
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Views</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No posts created yet. Get writing!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseOut={(e) => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>
                        <Link to={`/post/${post.slug}`} className="gradient-text" style={{ fontWeight: 600 }}>{post.title}</Link>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge">{post.category}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge" style={{
                          backgroundColor: post.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: post.status === 'published' ? 'var(--success)' : 'var(--warning)',
                          borderColor: 'transparent'
                        }}>
                          {post.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{post.views}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link to={`/admin/edit/${post._id}`} className="btn btn-secondary btn-small" style={{ padding: '0.4rem' }} title="Edit">
                            <Edit size={14} />
                          </Link>
                          <button onClick={() => handleDeletePost(post._id)} className="btn btn-secondary btn-small" style={{ padding: '0.4rem', color: 'var(--error)' }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Comments List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
                No comments submitted yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="glass-panel" style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  borderLeft: comment.isApproved ? '4px solid var(--success)' : '4px solid var(--warning)'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1rem' }}>{comment.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({comment.email})</span>
                        {!comment.isApproved && (
                          <span className="badge" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: 'var(--warning)', borderColor: 'transparent', fontSize: '0.7rem' }}>
                            Pending Approval
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                        <CornerDownRight size={12} />
                        <span>On Post: </span>
                        <Link 
                          to={`/post/${comment.post?.slug}`} 
                          style={{ color: 'var(--primary)', fontWeight: 500 }}
                        >
                          {comment.post?.title || 'Unknown Post'}
                        </Link>
                        <span>• {new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                        {comment.content}
                      </p>
                    </div>

                    {/* Moderation Controls */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!comment.isApproved && (
                        <button 
                          onClick={() => handleApproveComment(comment._id)} 
                          className="btn btn-secondary btn-small" 
                          style={{ color: 'var(--success)', borderColor: 'var(--success)', padding: '0.4rem' }}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteComment(comment._id)} 
                        className="btn btn-secondary btn-small" 
                        style={{ color: 'var(--error)', padding: '0.4rem' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
