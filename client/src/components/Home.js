import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-content">
          <h1>Welcome to DevMatch</h1>
          <p className="subtitle">Connect with developers who share your passion</p>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <h3>Swipe to Match</h3>
              <p>Discover developers based on shared skills and interests</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <h3>Real-Time Chat</h3>
              <p>Connect instantly with matched developers</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <h3>Build Together</h3>
              <p>Collaborate on projects and grow your network</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-btn secondary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;