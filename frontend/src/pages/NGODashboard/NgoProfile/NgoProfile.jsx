import React, { useState, useEffect } from 'react';
import './NgoProfile.css';
import axios from 'axios';
import NGODashboardNavbar from '../NGODashboardNavbar/NGODashboardNavbar';

const NgoProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('/api/ngo/profile');
      setProfile(response.data);
      setFormData(response.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsInteracting(true);
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/ngo/profile', formData);
      setEditMode(false);
      setIsInteracting(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!profile) return <div className="loading-text">Loading profile...</div>;

  return (
    <>
      <NGODashboardNavbar />
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
                <h2>Your NGO Profile</h2>
                <div className="form-wrapper">
                  <div className="form-group">
                    <input
                      name="ngoName"
                      value={formData.ngoName}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                    <label>NGO Name</label>
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
                  <div className="form-group">
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                    <label>Address</label>
                  </div>
                  <div className="form-group">
                    <input
                      name="ngoId"
                      value={formData.ngoId}
                      disabled
                      required
                    />
                    <label>NGO ID</label>
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

export default NgoProfile;
