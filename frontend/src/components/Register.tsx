// src/components/Register.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { RegisterRequest } from '../services/api';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    age: undefined,
    gender: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Convert age to number if it's the age field
    if (name === 'age') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Username, email and password are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }
    
    // Create a copy of form data without confirmPassword
    const registerData: RegisterRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.name || undefined,
      surname: formData.surname || undefined,
      age: formData.age,
      gender: formData.gender || undefined
    };
    
    try {
      setLoading(true);
      setError(null);
      await register(registerData);
      setSuccess('Registration successful! You can now log in.');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        age: undefined,
        gender: ''
      });
      
      // Automatically redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="font-montserrat text-2xl font-bold text-text mb-6 text-center">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Required Fields */}
          <div className="mb-4">
            <label htmlFor="username" className="block font-poppins font-medium mb-2 text-text">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block font-poppins font-medium mb-2 text-text">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block font-poppins font-medium mb-2 text-text">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-poppins font-medium mb-2 text-text">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          {/* Optional Fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block font-poppins font-medium mb-2 text-text">
              First Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="surname" className="block font-poppins font-medium mb-2 text-text">
              Last Name
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.surname}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="age" className="block font-poppins font-medium mb-2 text-text">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.age === undefined ? '' : formData.age}
              onChange={handleChange}
              disabled={loading}
              min={1}
              max={120}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="gender" className="block font-poppins font-medium mb-2 text-text">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-4 py-2 border border-neutral rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-poppins font-medium hover:bg-secondary transition-colors"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="font-inter text-text">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;