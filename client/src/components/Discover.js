import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discover.css';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedSkills]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected skills
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
    return <div className="loading">Loading developers...</div>;
  }

  return (
    <div className="discover-container">
      <div className="filters-panel">
        <h3>Filter Developers</h3>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, location, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

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
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {(searchTerm || selectedSkills.length > 0) && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-panel">
        <div className="results-header">
          <h2>Discovered Developers ({filteredUsers.length})</h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="no-results">
            <p>No developers match your criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="developers-grid">
            {filteredUsers.map(user => (
              <div key={user._id} className="developer-card">
                {user.profileImage && (
                  <img src={user.profileImage} alt={user.name} className="dev-image" />
                )}

                <div className="dev-content">
                  <h3>{user.name}</h3>

                  {user.location && (
                    <p className="dev-location">📍 {user.location}</p>
                  )}

                  {user.bio && (
                    <p className="dev-bio">{user.bio}</p>
                  )}

                  {user.skills && user.skills.length > 0 && (
                    <div className="dev-skills">
                      <h4>Skills</h4>
                      <div className="skills-tags">
                        {user.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.interests && user.interests.length > 0 && (
                    <div className="dev-interests">
                      <h4>Interests</h4>
                      <div className="interests-tags">
                        {user.interests.map((interest, idx) => (
                          <span key={idx} className="interest-tag">{interest}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(user.github || user.linkedin) && (
                    <div className="dev-links">
                      {user.github && (
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="link-btn">
                          GitHub
                        </a>
                      )}
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="link-btn">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;