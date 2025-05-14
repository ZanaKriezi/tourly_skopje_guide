// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlacesProvider } from './context/PlacesContext';
import { ToursProvider } from './context/ToursContext';
import { ReviewsProvider } from './context/ReviewsContext';
import AppRoutes from './routes';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <PlacesProvider>
          <ToursProvider>
            <ReviewsProvider>
              <AppRoutes />
            </ReviewsProvider>
          </ToursProvider>
        </PlacesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;