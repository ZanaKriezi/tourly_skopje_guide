// src/pages/RegisterPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { User, Mail, Lock, Type } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    gender: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, error: authError, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear auth error
    if (authError) {
      clearError();
    }
  };

  // Validate form
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
      // Email validation
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
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        surname: formData.surname || undefined,
        gender: formData.gender || undefined,
      };
      
      await register(registerData);
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        gender: '',
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Full-screen background */}
      <div className="fixed inset-0 bg-primary-100">
        {/* Decorative elements */}
        <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-full bg-primary-200 opacity-70"></div>
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full bg-primary-200 opacity-50"></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-primary-300 opacity-40"></div>
        <div className="absolute bottom-[30%] left-[20%] w-20 h-20 rounded-full bg-primary-300 opacity-30"></div>
        
        {/* Wavy pattern */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-40 text-primary-200 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Register container */}
      <div className="flex items-center justify-center min-h-screen p-4 py-10 relative z-10">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          {/* Image Section */}
          <div className="md:w-2/5 relative hidden md:block">
            <img 
              src="/skopjeCenter.jpg" 
              alt="Skopje City Center" 
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary-600/20"></div>
            
            {/* Overlay with Logo and Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-white/90 p-8 rounded-lg shadow-lg max-w-xs text-center transform rotate-[-5deg]">
                <img 
                  src="/logo.png" 
                  alt="Tourly Logo" 
                  className="w-16 h-16 mx-auto mb-3"
                />
                <h2 className="text-primary-700 font-bold text-2xl tracking-wider">TOURLY</h2>
                <p className="text-primary-600 text-sm mt-1 italic">Discover Skopje</p>
              </div>
            </div>
            
            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-xl">Join Our Community</h3>
              <p className="text-white/80 text-sm mt-1">Start your Skopje adventure</p>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="p-8 md:p-10 md:w-3/5">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join Tourly and explore Skopje today</p>
            </div>
            
            {/* Error Message */}
            {authError && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                {authError}
              </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200">
                {successMessage}
              </div>
            )}
            
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Required Fields */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      required
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-red-600 text-sm">{errors.username}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Optional Fields */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your first name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      placeholder="Your last name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
                >
                  Register
                </Button>
              </div>
            </form>
            
            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
            
            {/* Footer Message */}
            <div className="mt-5 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                Experience the beauty of Skopje with Tourly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;