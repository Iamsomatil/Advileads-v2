import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LeadsProvider } from './contexts/LeadsContext';
import { ForumProvider } from './contexts/ForumContext';
import Navbar from './components/Navbar';
import { useTrialManager } from './hooks/useTrialManager';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';
import AdminPanel from './pages/AdminPanel';
import Pricing from './pages/Pricing';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppContent() {
  const { user } = useAuth();
  useTrialManager(); // Initialize trial management

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/:threadId"
          element={
            <ProtectedRoute>
              <ForumThread />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId?"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LeadsProvider>
          <ForumProvider>
            <AppContent />
          </ForumProvider>
        </LeadsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
