import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="home" id="home-page">
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="home-container">
        <div className="home-content">
          <div className="hero-badge">
            <span>🚀</span> Built for developers, by developers
          </div>

          <h1 className="hero-title">
            Find your perfect
            <span className="gradient-text"> dev match</span>
          </h1>

          <p className="hero-subtitle">
            Connect with developers who share your passion. Swipe, match, and collaborate on 
            projects with like-minded builders from around the world.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🎯</span>
              </div>
              <h3>Smart Matching</h3>
              <p>Discover developers based on shared skills, interests, and goals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <span className="feature-icon">💬</span>
              </div>
              <h3>Real-Time Chat</h3>
              <p>Connect instantly with matched developers via live messaging</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🤝</span>
              </div>
              <h3>Build Together</h3>
              <p>Collaborate on projects, share knowledge, and grow your network</p>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary" id="cta-get-started">
              Get Started Free
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="cta-btn secondary" id="cta-login">
              Sign In
            </Link>
          </div>

          <div className="social-proof">
            <div className="avatar-stack">
              <div className="avatar-circle" style={{background: 'linear-gradient(135deg, #7c3aed, #ec4899)'}}>M</div>
              <div className="avatar-circle" style={{background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'}}>A</div>
              <div className="avatar-circle" style={{background: 'linear-gradient(135deg, #10b981, #06b6d4)'}}>S</div>
              <div className="avatar-circle" style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>R</div>
            </div>
            <p>Join <strong>1,000+</strong> developers already connecting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;