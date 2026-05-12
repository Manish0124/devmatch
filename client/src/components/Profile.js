import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
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
  const [messageType, setMessageType] = useState('success');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/profile');
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
      await api.put('/api/users/profile', formData);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading-skeleton" style={{height: '32px', width: '50%', margin: '0 auto 32px'}}></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{marginBottom: '24px'}}>
              <div className="loading-skeleton" style={{height: '14px', width: '20%', marginBottom: '8px'}}></div>
              <div className="loading-skeleton" style={{height: '44px', width: '100%'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" id="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt={formData.name} />
            ) : (
              <span>{formData.name ? formData.name.charAt(0).toUpperCase() : '?'}</span>
            )}
          </div>
          <h1>Edit Profile</h1>
          <p className="profile-subtitle">Keep your profile up to date</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              id="profile-name"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
              id="profile-bio"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="City, Country"
              id="profile-location"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Skills <span className="label-hint">(comma-separated)</span></label>
              <input
                type="text"
                value={(formData.skills || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'skills')}
                placeholder="React, Node.js, MongoDB..."
                id="profile-skills"
              />
            </div>

            <div className="form-group">
              <label>Interests <span className="label-hint">(comma-separated)</span></label>
              <input
                type="text"
                value={(formData.interests || []).join(', ')}
                onChange={(e) => handleArrayChange(e, 'interests')}
                placeholder="Startups, Open Source, AI..."
                id="profile-interests"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                name="github"
                value={formData.github || ''}
                onChange={handleChange}
                placeholder="https://github.com/username"
                id="profile-github"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                id="profile-linkedin"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Profile Image URL</label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              id="profile-image"
            />
          </div>

          {message && (
            <p className={`profile-message ${messageType}`}>{message}</p>
          )}

          <button type="submit" className="save-btn" disabled={saving} id="profile-save">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <button className="logout-btn" onClick={logout} id="profile-logout">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;