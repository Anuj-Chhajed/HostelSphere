import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// A placeholder for the dashboard which we will build in the next phase
const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '16px' }}>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You are logged in securely as a <strong>{user?.role}</strong>.</p>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
            <h3>Dashboard Module Pending...</h3>
            <p style={{ marginTop: '12px', color: 'var(--text-tertiary)' }}>This area will house all your widgets (Allocations, Complaints, Payments) in Phase 8.2.</p>
            <button className="btn-secondary" style={{ marginTop: '24px' }} onClick={logout}>Sign Out</button>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
