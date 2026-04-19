import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// A placeholder for the dashboard which we will build in the next phase
const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-10 max-w-4xl mx-auto min-h-screen text-textPrimary">
        <h1 className="text-3xl font-display font-semibold mb-4">Welcome, {user?.name}</h1>
        <p className="text-textSecondary mb-8 text-lg">You are logged in securely as a <span className="font-semibold text-accentPrimary">{user?.role}</span>.</p>
        
        <div className="glass-panel p-8 animate-slideUpFade">
            <h3 className="text-xl font-display font-semibold">Dashboard Module Pending...</h3>
            <p className="mt-3 text-textSecondary leading-relaxed">This area will house all your dynamic widgets (Allocations, Complaints, Payments) using Tailwind layouts in Phase 8.2.</p>
            <button className="btn-secondary mt-8" onClick={logout}>Sign Out</button>
        </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading Secure Session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
