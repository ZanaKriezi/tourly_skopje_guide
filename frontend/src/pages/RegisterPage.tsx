import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join Skopje Tourism Guide today"
      linkText="Already have an account? |Sign in here"
      linkTo="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;