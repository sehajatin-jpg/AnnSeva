import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import "./Signup.css";
import API from "../../api";

const VolunteerSignup = () => {
  const navigate = useNavigate(); // <-- Initialize navigate hook

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup/volunteer", formData, {
        withCredentials: true,
      });

      setSuccess(res.data.message || "Signed up successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });

      localStorage.setItem("volunteerToken", res.data.token);
      // console.log(res.data.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      // ✅ Redirect to dashboard after success
      setTimeout(() => {
        
        navigate("/volunteerDashboard/home");
      }, 1000); // Optional delay for message visibility

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="volunteer-signup-container">
      <h2>Volunteer Signup</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <form onSubmit={handleSubmit} className="volunteer-signup-form">
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default VolunteerSignup;
