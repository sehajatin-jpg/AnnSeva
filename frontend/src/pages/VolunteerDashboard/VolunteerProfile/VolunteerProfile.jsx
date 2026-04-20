import React, { useState, useEffect } from 'react';
import './VolunteerProfile.css';
import axios from 'axios';
import VolunteerDashboardNavbar from '../VolunteerDashboardNavbar/VolunteerDashboardNavbar';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false); // NEW

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('/api/volunteer/profile');
      setProfile(response.data);
      setFormData(response.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsInteracting(true); // NEW
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
    setIsInteracting(true); // NEW
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/volunteer/profile', formData);
      setEditMode(false);
      setIsInteracting(false); // Reset on save
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!profile) return <div className="loading-text">Loading profile...</div>;

  return (
    <>
      <VolunteerDashboardNavbar />
      <div className="profile-page">
        <div className={`flip-card ${isInteracting ? 'no-hover' : ''}`}>
          <div className="flip-card-inner">
            {/* FRONT SIDE */}
            <div className="flip-card-front">
              <div className="profile-card-back">
                <h2>HOVER!</h2>
                <p>To view or edit your profile.</p>
              </div>
            </div>

            {/* BACK SIDE */}
            <div className="flip-card-back">
              <div className="profile-card">
                <h2>Your Profile</h2>
                <div className="avatar-wrapper">
                  <img
                    src={avatar || profile.avatarUrl || '/default-avatar.png'}
                    alt="Avatar"
                    className="avatar-img"
                  />
                  {editMode && (
                    <input type="file" className="avatar-input" onChange={handleAvatarChange} />
                  )}
                </div>
                <div className="form-wrapper">
                  <div className="form-group">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                    <label>Name</label>
                  </div>
                  <div className="form-group">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      required
                    />
                    <label>Email</label>
                  </div>
                  <div className="form-group">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                    <label>Phone</label>
                  </div>
                </div>
                <div className="btn-row">
                  {editMode ? (
                    <button onClick={handleSave}>Save</button>
                  ) : (
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerProfile;
