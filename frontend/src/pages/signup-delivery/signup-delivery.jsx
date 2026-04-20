import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup-delivery.css'; // Updated import for correct CSS file
import API from '../../api';

const SignupDelivery = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    password: '',
    phone: '',
    address: '',
    drivingId: ''  // Fixed typo from "Drivng" to "drivingID"
  });

  const [drivingLisenceFile, setDrivingLisenceFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setDrivingLisenceFile(e.target.files[0]);
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
      if (drivingLisenceFile) {
        data.append('drivingLisence', drivingLisenceFile);
      }

      const res = await API.post('/auth/signup/agent', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('Delivery Agent signup successful! 🎉');

      console.log(res.data.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      // ✅ Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/DeliveryAgentDashboard/home');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="delivery-signup-container">
      <h2>Delivery Agent Signup</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
  
      <form onSubmit={handleSubmit} className="delivery-signup-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
  
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
  
        <input
          type="text"
          name="bio"
          placeholder="Bio (optional)"
          value={formData.bio}
          onChange={handleChange}
        />
  
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
  
        <input
          type="text"
          name="phone"
          placeholder="Phone (e.g. +911234567890)"
          value={formData.phone}
          onChange={handleChange}
          required
        />
  
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
  
        <input
          type="text"
          name="drivingId"
          placeholder="Driving Id"
          value={formData.drivingId}
          onChange={handleChange}
          required
        />
          <h4>Driving License Photo</h4>
        <input 
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          required
        />
  
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
  
};

export default SignupDelivery;