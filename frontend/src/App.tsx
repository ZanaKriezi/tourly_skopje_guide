// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  // Your Google Maps API key - store this in an environment variable for security
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

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
              <Route path="/map" element={<MapPage apiKey={googleMapsApiKey} />} />
              
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