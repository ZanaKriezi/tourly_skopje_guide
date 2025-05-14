// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlacesProvider } from './context/PlacesContext';
import AppRoutes from './routes';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <PlacesProvider>
          <AppRoutes />
        </PlacesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;