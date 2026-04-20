// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api.js";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Backend endpoint for all users (volunteer/ngo/delivery agent)
      const res = await API.post("/auth/login", formData, { withCredentials: true });
      console.log(res)

      const payload = res?.data?.data || res?.data || {};
      const user = payload.user || {};
      const role = user.role;

      // Store minimal user data for UI use
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: user._id,
          name: user.name || user.username || "",
          email: user.email,
          role: role,
        })
      );

      setSuccess("Login successful! Redirecting...");

      // Redirect by user role
      if (role === "Volunteer") {
        navigate("/volunteerDashboard/home");
      } else if (role === "NGO") {
        navigate("/ngoDashboard/home");
      } else if (role === "DeliveryAgent") {
        navigate("/deliveryAgentDashboard/home");
      } else {
        // Fallback in case of unknown role
        navigate("/");
      }
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please try again.";
      setError(serverMsg);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
