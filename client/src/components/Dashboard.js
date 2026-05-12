import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (liked) => {
    const token = localStorage.getItem('token');
    const swipedUserId = users[currentIndex]._id;

    try {
      await axios.post('http://localhost:5000/api/matches/swipe', 
        { swipedUserId, liked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (currentIndex >= users.length) {
    return (
      <div className="dashboard-container">
        <div className="no-users">
          <h2>No more developers to discover</h2>
          <p>Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <div className="dashboard-container">
      <div className="card-container">
        <div className="user-card">
          <div className="card-header">
            <h2>{currentUser.name}</h2>
            <p className="location">{currentUser.location || 'Not specified'}</p>
          </div>
          
          {currentUser.profileImage && (
            <img src={currentUser.profileImage} alt={currentUser.name} className="profile-image" />
          )}
          
          <div className="card-content">
            {currentUser.bio && (
              <div className="section">
                <h3>About</h3>
                <p>{currentUser.bio}</p>
              </div>
            )}
            
            {currentUser.skills && currentUser.skills.length > 0 && (
              <div className="section">
                <h3>Skills</h3>
                <div className="tags">
                  {currentUser.skills.map((skill, idx) => (
                    <span key={idx} className="tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="section">
                <h3>Interests</h3>
                <div className="tags">
                  {currentUser.interests.map((interest, idx) => (
                    <span key={idx} className="tag interest">{interest}</span>
                  ))}
                </div>
              </div>
            )}
            
            {(currentUser.github || currentUser.linkedin) && (
              <div className="section">
                <h3>Connect</h3>
                <div className="links">
                  {currentUser.github && (
                    <a href={currentUser.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                  )}
                  {currentUser.linkedin && (
                    <a href={currentUser.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="pass-btn" onClick={() => handleSwipe(false)}>
              ✕ Pass
            </button>
            <button className="like-btn" onClick={() => handleSwipe(true)}>
              ❤ Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;