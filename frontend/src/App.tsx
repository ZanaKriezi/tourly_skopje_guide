import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Add protected routes here */}
                {/* For example: <Route path="/profile" element={<ProfilePage />} /> */}
              </Route>
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                {/* Add admin routes here */}
                {/* For example: <Route path="/admin" element={<AdminDashboard />} /> */}
              </Route>
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;