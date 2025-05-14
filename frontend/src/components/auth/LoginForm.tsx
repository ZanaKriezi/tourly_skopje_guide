// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear auth error when user makes any change
    if (authError) {
      clearError();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(formData);
      navigate('/'); // Redirect to home on success
    } catch (err) {
      // Error is already set in auth context
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && (
        <ErrorMessage message={authError} />
      )}
      
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
        disabled={isSubmitting}
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        disabled={isSubmitting}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Log In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;