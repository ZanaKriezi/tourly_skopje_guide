// src/routes/index.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PlacesPage from '../pages/PlacesPage';
import PlacesSearchPage from '../pages/PlacesSearchPage';
import PlaceDetailsPage from '../pages/PlaceDetailsPage';
import ToursPage from '../pages/ToursPage';
import TourDetailsPage from '../pages/TourDetailsPage';
import TourEditPage from '../pages/TourEditPage';
import ProfilePage from '../pages/ProfilePage';
import UserReviewsPage from '../pages/UserReviewsPage';
import ProtectedRoute from './ProtectedRoute';
import PageLayout from '../components/layout/PageLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/places" element={<PageLayout><PlacesPage /></PageLayout>} />
      <Route path="/places/search" element={<PageLayout><PlacesSearchPage /></PageLayout>} />
      <Route path="/places/:id" element={<PageLayout><PlaceDetailsPage /></PageLayout>} />
      <Route path="/tours" element={<PageLayout><ToursPage /></PageLayout>} />
      <Route path="/tours/:id" element={<PageLayout><TourDetailsPage /></PageLayout>} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<PageLayout><ProfilePage /></PageLayout>} />
        <Route path="/tours/:id/edit" element={<PageLayout><TourEditPage /></PageLayout>} />
        <Route path="/my-reviews" element={<PageLayout><UserReviewsPage /></PageLayout>} />
        {/* Add other protected routes here */}
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;