// src/pages/ProfilePage.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/auth/UserProfile';
import Container from '../components/layout/Container';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner size="lg" text="Loading profile..." />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="max-w-lg mx-auto">
        <UserProfile />
      </div>
    </Container>
  );
};

export default ProfilePage;