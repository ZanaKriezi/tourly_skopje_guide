// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest } from '../../types/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    gender: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
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
    
    // Required fields
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      
      // Create a copy without confirmPassword
      const registerData: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        surname: formData.surname || undefined,
        gender: formData.gender || undefined,
      };
      
      await register(registerData);
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        gender: '',
      });
      
      // Navigate to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error is already set in auth context
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authError && (
        <ErrorMessage message={authError} />
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required Fields */}
        <div className="md:col-span-2">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
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
        </div>
        
        <div>
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            disabled={isSubmitting}
          />
        </div>
        
        {/* Optional Fields */}
        <div>
          <Input
            label="First Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Input
            label="Last Name"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="gender" className="block font-medium mb-1 text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;