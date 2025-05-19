// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-montserrat text-2xl font-bold">Tourly</Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="font-poppins">
                Welcome, {user?.name || user?.username}
              </span>
              
              <button 
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-2 rounded font-poppins hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
            // In your Header component
              <Link to="/map" className="your-link-classes">Skopje Map</Link>
              <Link 
                to="/login" 
                className="bg-white text-primary px-4 py-2 rounded font-poppins hover:bg-gray-100 transition-colors"
              >
                Log In
              </Link>
              
              <Link 
                to="/register" 
                className="bg-accent text-white px-4 py-2 rounded font-poppins hover:bg-opacity-90 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;