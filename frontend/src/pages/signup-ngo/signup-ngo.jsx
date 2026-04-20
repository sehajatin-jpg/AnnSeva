import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import './signup-ngo.css';

const SignupNGO = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    ngoId: ''
  });
  const [verifiedNGOFile, setVerifiedNGOFile] = useState(null);
  const [ngoPhoto, setNgoPhoto] = useState(null); // New state for NGO photo
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // 👈 hook for navigation

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setVerifiedNGOFile(e.target.files[0]);
  };

  const handleNgoPhotoChange = (e) => {
    setNgoPhoto(e.target.files[0]); // Handle NGO photo file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
  
      if (verifiedNGOFile) {
        data.append('verifiedNGO', verifiedNGOFile); // ✅ matches multer field
      }
      
      if (ngoPhoto) {
        data.append('avatar', ngoPhoto); // ✅ renamed to match multer field
      }
  
      const res = await API.post('/auth/signup/ngo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setSuccess('NGO signup successful! 🎉');
      console.log(res.data.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
  
      setTimeout(() => {
        navigate('/NGODashboard/home');
      }, 1000);
  
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };
  

  return (
    <div className="ngo-signup-container">
      <h2 className="ngo-signup-title">NGO Signup</h2>
      {error && <p className="ngo-error-msg">{error}</p>}
      {success && <p className="ngo-success-msg">{success}</p>}
  
      <form onSubmit={handleSubmit} className="ngo-signup-form">
        <input
          type="text"
          name="name"
          placeholder="NGO Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ngoId"
          placeholder="NGO ID"
          required
          value={formData.ngoId}
          onChange={handleChange}
        />
  
        <label className="ngo-file-upload-label">
          Upload NGO Verification (PDF/Image)
          <input
            type="file"
            name="verifiedNGO"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            required
          />
        </label>

        {/* NGO Photo Upload Field */}
        <label className="ngo-photo-upload-label">
          Upload NGO Photo
          <input
            type="file"
            name="avatar"
            accept=".png,.jpg,.jpeg"
            onChange={handleNgoPhotoChange} // Handle photo change
            required
          />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupNGO;
