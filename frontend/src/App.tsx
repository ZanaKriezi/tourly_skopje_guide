// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import PlacesPage from './pages/PlacesPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import ToursPage from './pages/ToursPage';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  // Your Google Maps API key - store this in an environment variable for security
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCJIYdrnrRp1x3d-nQOLTVA5v940bTjUT4';

  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col bg-background">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/map" element={<MapPage apiKey={googleMapsApiKey} />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/places/:id" element={<PlaceDetailsPage />} />
              <Route path="/tours" element={<ToursPage />} />

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
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;