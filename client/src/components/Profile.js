import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
    interests: [],
    location: '',
    github: '',
    linkedin: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        ...formData,
        ...response.data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, fieldName) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({ ...prev, [fieldName]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Edit Your Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) => handleArrayChange(e, 'skills')}
              placeholder="React, Node.js, MongoDB..."
            />
          </div>

          <div className="form-group">
            <label>Interests (comma-separated)</label>
            <input
              type="text"
              value={formData.interests.join(', ')}
              onChange={(e) => handleArrayChange(e, 'interests')}
              placeholder="Startups, Open Source, AI..."
            />
          </div>

          <div className="form-group">
            <label>GitHub Profile</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-group">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label>Profile Image URL</label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {message && <p className="message">{message}</p>}

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;