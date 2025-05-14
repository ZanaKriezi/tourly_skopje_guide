// src/components/auth/UserProfile.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

interface UserProfileProps {
  minimal?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ minimal = false }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  if (minimal) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm">
          {user.name || user.username}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      
      <div className="space-y-2">
        <div>
          <span className="font-medium">Username:</span> {user.username}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        {user.name && (
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
        )}
        {user.surname && (
          <div>
            <span className="font-medium">Surname:</span> {user.surname}
          </div>
        )}
        <div>
          <span className="font-medium">Role:</span> {user.role.replace('ROLE_', '')}
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;