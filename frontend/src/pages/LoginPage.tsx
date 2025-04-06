import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Sign In" 
      subtitle="Welcome back to Skopje Tourism Guide"
      linkText="Don't have an account? |Register here"
      linkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;