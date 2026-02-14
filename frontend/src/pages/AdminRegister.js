import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { FaUserShield, FaKey } from 'react-icons/fa';
import './AdminRegister.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminAPI.registerAdmin(formData);
      alert('Admin registered successfully! Please login.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-page">
      <div className="admin-register-container">
        <div className="admin-register-header">
          <FaUserShield className="admin-icon" />
          <h1>Admin Registration</h1>
          <p>Register with special admin key</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group admin-key-group">
            <label>
              <FaKey /> Admin Secret Key
            </label>
            <input
              type="password"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              required
              placeholder="Enter admin secret key"
              className="admin-key-input"
            />
            <small>Contact administrator for the secret key</small>
          </div>

          <button type="submit" disabled={loading} className="admin-register-btn">
            {loading ? 'Registering...' : 'Register as Admin'}
          </button>

          <div className="register-footer">
            <p>Already have an account? <a href="/login">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
