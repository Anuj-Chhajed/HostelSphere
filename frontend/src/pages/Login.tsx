import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, api } from '../contexts/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Decorative Glows */}
      <div className="bg-glow-purple" />
      <div className="bg-glow-emerald" />

      {/* Login Card */}
      <div className="glass-panel p-8 sm:p-12 max-w-md w-full relative z-10 animate-slideUpFade">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-semibold mb-2">SmartHostel</h1>
          <p className="text-textSecondary">Welcome back! Sign in to access your dashboard.</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm border border-error/20">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-textSecondary">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute top-3.5 left-4 text-textTertiary" />
              <input 
                id="email"
                type="email" 
                placeholder="Ex. student@university.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11"
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-textSecondary">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute top-3.5 left-4 text-textTertiary" />
              <input 
                id="password"
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-8 h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
              <>Confirm Sign In <LogIn size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textSecondary">
          Don't have an account? <Link to="/register" className="text-accentPrimary font-medium hover:text-accentHover transition-colors ml-1">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
