import React, { useEffect, useState } from 'react';
import './VolunteerDonate.css';
import VolunteerDashboardNavbar from '../VolunteerDashboardNavbar/VolunteerDashboardNavbar';
import API from '../../../api';

const VolunteerDonate = () => {
  const [ngoId, setNgoId] = useState('');
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedNgoId = localStorage.getItem('selectedNGOId');
    if (storedNgoId) {
      setNgoId(storedNgoId); // Store in internal state
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ngoId) {
      setMessage("NGO ID missing. Please go back and select an NGO.");
      return;
    }

    try {
      const payload = {
        ...formData,
        ngoId,
      };

      const response = await API.post('/food-donations/', payload);
      setMessage('Donation submitted successfully!');
      setFormData({
        foodType: '',
        quantity: '',
        pickupAddress: '',
        description: '',
      });
    } catch (error) {
      console.error(error);
      setMessage('Error submitting donation. Try again!');
    }
  };

  return (
    <>
      <VolunteerDashboardNavbar />
      <div className="donate-page">
        <div className="donate-card">
          <h2>Donate Food</h2>
          <form onSubmit={handleSubmit} className="donate-form">
            <input
              type="text"
              name="foodType"
              placeholder="Type of Food"
              value={formData.foodType}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity (in kg)"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <textarea
              name="pickupAddress"
              placeholder="Pickup Address"
              value={formData.pickupAddress}
              onChange={handleChange}
              rows={3}
              required
            />
            <textarea
              name="description"
              placeholder="Additional Description (optional)"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
            <button type="submit">Donate Now</button>
          </form>
          {message && <p className="donate-message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default VolunteerDonate;
