// src/components/Register/Register.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name required';
    if (!formData.lastName) newErrors.lastName = 'Last name required';
    if (!formData.email) newErrors.email = 'Valid email required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Keys do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Node Registration Successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container container animate-fade-in">
      <div className="register-card card">
        <div className="register-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="logo" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Join Network</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Register new station on the blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="grid-2">
            <div className="input-row">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>
            <div className="input-row">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>
          </div>

          <div className="input-row">
            <label>Communication ID (Email)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="node@pharma.net" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-row">
            <label>Security Key (Password)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input-row">
            <label>Confirm Security Key</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: '24px' }} disabled={loading}>
            {loading ? 'Processing Node ID...' : 'Initialize Station'}
          </button>
        </form>

        <div className="register-footer" style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Already have a node? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Authenticate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
