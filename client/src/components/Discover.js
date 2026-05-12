import React, { useState, useEffect } from 'react';
import api from '../api';
import Reviews from './Reviews';
import './Discover.css';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSkills, setAllSkills] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm, selectedSkills]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/users');
      setUsers(response.data);

      // Extract all unique skills
      const skillsSet = new Set();
      response.data.forEach(user => {
        user.skills?.forEach(skill => skillsSet.add(skill));
      });
      setAllSkills(Array.from(skillsSet).sort());

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(user =>
        selectedSkills.some(skill => user.skills?.includes(skill))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
  };

  if (loading) {
    return (
      <div className="discover-container" id="discover-loading">
        <div className="filters-panel">
          <div className="loading-skeleton" style={{height: '24px', width: '60%', marginBottom: '20px'}}></div>
          <div className="loading-skeleton" style={{height: '40px', marginBottom: '20px'}}></div>
          <div className="loading-skeleton" style={{height: '200px'}}></div>
        </div>
        <div className="results-panel">
          <div className="developers-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="developer-card" style={{padding: '24px'}}>
                <div className="loading-skeleton" style={{height: '48px', width: '48px', borderRadius: '12px', marginBottom: '16px'}}></div>
                <div className="loading-skeleton" style={{height: '20px', width: '60%', marginBottom: '8px'}}></div>
                <div className="loading-skeleton" style={{height: '16px', width: '80%', marginBottom: '16px'}}></div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <div className="loading-skeleton" style={{height: '28px', width: '60px', borderRadius: '14px'}}></div>
                  <div className="loading-skeleton" style={{height: '28px', width: '80px', borderRadius: '14px'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-container" id="discover-page">
      <div className="filters-panel">
        <h3>🔍 Filter</h3>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            id="discover-search"
          />
        </div>

        {allSkills.length > 0 && (
          <div className="skills-filter">
            <h4>Skills</h4>
            <div className="skills-list">
              {allSkills.map(skill => (
                <label key={skill} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                  />
                  <span className="checkbox-custom"></span>
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {(searchTerm || selectedSkills.length > 0) && (
          <button className="clear-btn" onClick={clearFilters} id="clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-panel">
        <div className="results-header">
          <h2>Developers</h2>
          <span className="results-count">{filteredUsers.length} found</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="no-results">
            <span className="empty-icon">🔎</span>
            <p>No developers match your criteria.</p>
            <p className="hint">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="developers-grid">
            {filteredUsers.map(user => (
              <div key={user._id} className="developer-card">
                <div className="dev-header">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="dev-avatar" />
                  ) : (
                    <div className="dev-avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="dev-info">
                    <h3>{user.name}</h3>
                    {user.location && (
                      <p className="dev-location">📍 {user.location}</p>
                    )}
                  </div>
                  {user.averageRating > 0 && (
                    <div className="dev-rating">
                      <span className="star">★</span> {user.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>

                {user.bio && (
                  <p className="dev-bio">{user.bio}</p>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div className="dev-tags">
                    {user.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="tag skill-tag">{skill}</span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="tag more-tag">+{user.skills.length - 4}</span>
                    )}
                  </div>
                )}

                {user.interests && user.interests.length > 0 && (
                  <div className="dev-tags">
                    {user.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="tag interest-tag">{interest}</span>
                    ))}
                  </div>
                )}

                <div className="dev-footer">
                  {(user.github || user.linkedin) && (
                    <div className="dev-links">
                      {user.github && (
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="link-btn">
                          GitHub ↗
                        </a>
                      )}
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="link-btn">
                          LinkedIn ↗
                        </a>
                      )}
                    </div>
                  )}
                  <button
                    className="reviews-toggle-btn"
                    onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                  >
                    {expandedUser === user._id ? 'Hide Reviews' : 'Reviews'}
                  </button>
                </div>

                {expandedUser === user._id && (
                  <div className="dev-reviews-section">
                    <Reviews userId={user._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;