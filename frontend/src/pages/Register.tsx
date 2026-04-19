import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  // Using standard Student registration as a default flow
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-background" />
        <div className="auth-card glass-panel flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '20px', borderRadius: '50%', marginBottom: '24px' }}>
                <UserPlus size={48} />
            </div>
            <h2>Account Created!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Routing you to the login screen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-background" />

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h1>Join SmartHostel</h1>
          <p>Create a new account to enter the system.</p>
        </div>

        {error && (
          <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="floating-label-input" style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-tertiary)' }} />
                  <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} style={{ paddingLeft: '44px' }} required />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <div className="floating-label-input" style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-tertiary)' }} />
                  <input name="phone" type="text" placeholder="9876543210" value={formData.phone} onChange={handleChange} style={{ paddingLeft: '44px' }} />
                </div>
              </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="floating-label-input" style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input name="email" type="email" placeholder="student@university.edu" value={formData.email} onChange={handleChange} style={{ paddingLeft: '44px' }} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="floating-label-input" style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-tertiary)' }} />
              <input name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} style={{ paddingLeft: '44px' }} required />
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
                <option value="STUDENT">Student</option>
                <option value="WARDEN">Warden</option>
                <option value="ACCOUNTANT">Accountant</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting} style={{ marginTop: '24px' }}>
            {isSubmitting ? 'Creating...' : (
              <>
                Create Account <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
