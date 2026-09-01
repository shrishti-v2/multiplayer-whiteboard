import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { whiteboardAPI } from '../utils/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchWhiteboards();
  }, [isAuthenticated, navigate]);

  const fetchWhiteboards = async () => {
    setLoading(true);
    try {
      const response = await whiteboardAPI.getAll();
      setWhiteboards(response.data.whiteboards || []);
    } catch (error) {
      console.error('Failed to fetch whiteboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWhiteboard = async (e) => {
    e.preventDefault();
    try {
      const response = await whiteboardAPI.create(title || 'Untitled', false);
      navigate(`/whiteboard/${response.data.whiteboard.roomId}`);
    } catch (error) {
      console.error('Failed to create whiteboard:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="home">
      <Header />
      <div className="home-content">
        <div className="home-header">
          <h1>Your Whiteboards</h1>
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            <FiPlus size={20} /> New Whiteboard
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-overlay">
            <div className="create-form-box">
              <h2>Create New Whiteboard</h2>
              <form onSubmit={handleCreateWhiteboard}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter whiteboard title"
                  autoFocus
                />
                <div className="form-buttons">
                  <button type="submit">Create</button>
                  <button type="button" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : whiteboards.length > 0 ? (
          <div className="whiteboards-grid">
            {whiteboards.map((wb) => (
              <div
                key={wb._id}
                className="whiteboard-card"
                onClick={() => navigate(`/whiteboard/${wb.roomId}`)}
              >
                <div className="card-image">
                  {wb.thumbnail ? (
                    <img src={wb.thumbnail} alt={wb.title} />
                  ) : (
                    <div className="no-thumbnail">🎨</div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{wb.title}</h3>
                  <p>by {wb.createdBy.username}</p>
                  <time>{new Date(wb.createdAt).toLocaleDateString()}</time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No whiteboards yet</h2>
            <p>Create your first whiteboard to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
