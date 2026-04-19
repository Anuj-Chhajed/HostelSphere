import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
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

    // INTERCEPT: Auto-generate Enrollment Number under the hood to improve Tester UX!
    const submissionData: any = { ...formData };
    if (submissionData.role === 'STUDENT') {
      submissionData.enrollmentNumber = 'STU-' + Math.floor(10000 + Math.random() * 90000);
    }

    try {
      await api.post('/auth/register', submissionData);
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
        <div className="bg-glow-purple" />
        <div className="bg-glow-emerald" />
        <div className="glass-panel text-center p-12 max-w-sm w-full animate-slideUpFade relative z-10 flex flex-col items-center">
            <div className="bg-success/10 text-success p-6 rounded-full mb-6">
                <UserPlus size={48} />
            </div>
            <h2 className="text-2xl font-display font-semibold mb-2">Account Created!</h2>
            <p className="text-textSecondary">Routing you to the login screen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-y-auto py-12 flex items-center justify-center">
      {/* Decorative Glows */}
      <div className="bg-glow-purple" />
      <div className="bg-glow-emerald" />

      <div className="glass-panel p-8 sm:p-10 max-w-xl w-full mx-4 relative z-10 animate-slideUpFade">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2">Join SmartHostel</h1>
          <p className="text-textSecondary">Initialize your account to enter the ecosystem.</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-error/20">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute top-3.5 left-4 text-textTertiary" />
                  <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="input-field pl-11" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary">Phone <span className="opacity-60 font-normal">(Optional)</span></label>
                <div className="relative">
                  <Phone size={18} className="absolute top-3.5 left-4 text-textTertiary" />
                  <input name="phone" type="text" placeholder="9876543210" value={formData.phone} onChange={handleChange} className="input-field pl-11" />
                </div>
              </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-textSecondary">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute top-3.5 left-4 text-textTertiary" />
              <input name="email" type="email" placeholder="student@university.edu" value={formData.email} onChange={handleChange} className="input-field pl-11" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute top-3.5 left-4 text-textTertiary" />
                  <input name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="input-field pl-11" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="input-field bg-bgSecondary/50 font-medium">
                    <option value="STUDENT">Student</option>
                    <option value="WARDEN">Warden</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="ADMIN">Admin</option>
                </select>
              </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-8 h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
              <>Create Account <UserPlus size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textSecondary">
          Already have an account? <Link to="/login" className="text-accentPrimary font-medium hover:text-accentHover transition-colors ml-1">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
