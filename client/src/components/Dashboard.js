import React, { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (liked) => {
    if (currentIndex >= users.length) return;

    const swipedUser = users[currentIndex];
    setSwipeDirection(liked ? 'right' : 'left');

    try {
      const response = await api.post('/api/matches/swipe', {
        swipedUserId: swipedUser._id,
        liked,
      });

      // Check for mutual match
      if (response.data.isMatch) {
        setMatchedUser(swipedUser);
        setShowMatch(true);
      }
    } catch (error) {
      console.error('Error swiping:', error);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const closeMatchModal = () => {
    setShowMatch(false);
    setMatchedUser(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="card-container">
          <div className="user-card skeleton-card">
            <div className="skeleton-header loading-skeleton"></div>
            <div className="skeleton-body">
              <div className="skeleton-line loading-skeleton" style={{width: '60%'}}></div>
              <div className="skeleton-line loading-skeleton" style={{width: '80%'}}></div>
              <div className="skeleton-line loading-skeleton" style={{width: '40%'}}></div>
              <div className="skeleton-tags">
                <div className="skeleton-tag loading-skeleton"></div>
                <div className="skeleton-tag loading-skeleton"></div>
                <div className="skeleton-tag loading-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="dashboard-container" id="dashboard-empty">
        <div className="no-users">
          <div className="empty-icon">🔍</div>
          <h2>No more developers</h2>
          <p>You've seen everyone for now. Check back later for new profiles!</p>
        </div>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <div className="dashboard-container" id="dashboard-page">
      <div className="dashboard-header">
        <h2>Find your match</h2>
        <span className="card-counter">{currentIndex + 1} / {users.length}</span>
      </div>

      <div className="card-container">
        <div className={`user-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
          <div className="card-header">
            <div className="card-avatar">
              {currentUser.profileImage ? (
                <img src={currentUser.profileImage} alt={currentUser.name} />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="card-title">
              <h2>{currentUser.name}</h2>
              <p className="location">
                {currentUser.location ? `📍 ${currentUser.location}` : '🌍 Location not set'}
              </p>
            </div>
            {currentUser.averageRating > 0 && (
              <div className="card-rating">
                <span className="star">★</span>
                <span>{currentUser.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="card-content">
            {currentUser.bio && (
              <div className="section">
                <p className="bio-text">{currentUser.bio}</p>
              </div>
            )}
            
            {currentUser.skills && currentUser.skills.length > 0 && (
              <div className="section">
                <h3>Skills</h3>
                <div className="tags">
                  {currentUser.skills.map((skill, idx) => (
                    <span key={idx} className="tag skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="section">
                <h3>Interests</h3>
                <div className="tags">
                  {currentUser.interests.map((interest, idx) => (
                    <span key={idx} className="tag interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
            )}
            
            {(currentUser.github || currentUser.linkedin) && (
              <div className="section social-links">
                {currentUser.github && (
                  <a href={currentUser.github} target="_blank" rel="noopener noreferrer" className="social-btn">
                    GitHub ↗
                  </a>
                )}
                {currentUser.linkedin && (
                  <a href={currentUser.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                    LinkedIn ↗
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="pass-btn" onClick={() => handleSwipe(false)} id="swipe-pass">
              <span className="btn-icon">✕</span>
              Pass
            </button>
            <button className="like-btn" onClick={() => handleSwipe(true)} id="swipe-like">
              <span className="btn-icon">❤</span>
              Like
            </button>
          </div>
        </div>
      </div>

      {/* Match Celebration Modal */}
      {showMatch && matchedUser && (
        <div className="match-overlay" onClick={closeMatchModal}>
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="match-particles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="particle" style={{
                  '--delay': `${i * 0.1}s`,
                  '--angle': `${i * 30}deg`,
                }}></div>
              ))}
            </div>
            <div className="match-content">
              <h2 className="match-title">It's a Match! 🎉</h2>
              <p className="match-text">You and <strong>{matchedUser.name}</strong> liked each other</p>
              <div className="match-avatar">
                {matchedUser.profileImage ? (
                  <img src={matchedUser.profileImage} alt={matchedUser.name} />
                ) : (
                  <div className="match-avatar-placeholder">
                    {matchedUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="match-actions">
                <button className="match-message-btn" onClick={() => {
                  closeMatchModal();
                  window.location.href = '/messages';
                }}>
                  Send Message
                </button>
                <button className="match-continue-btn" onClick={closeMatchModal}>
                  Keep Swiping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;