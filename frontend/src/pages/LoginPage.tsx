// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { User, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
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
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!credentials.password) {
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
      await login(credentials);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
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
      
      {/* Login container */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          {/* Image Section */}
          <div className="md:w-1/2 relative hidden md:block">
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
              <h3 className="text-white font-bold text-xl">Skopje, Macedonia</h3>
              <p className="text-white/80 text-sm mt-1">Your ultimate travel companion</p>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="p-8 md:p-10 md:w-1/2">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Log In to Tourly</h1>
              <p className="text-gray-600">Welcome back to your journey</p>
            </div>
            
            {/* Error Message */}
            {authError && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                {authError}
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    className={`w-full pl-10 pr-3 py-3 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-red-600 text-sm">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className={`w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  className="py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
                >
                  Log In
                </Button>
              </div>
            </form>
            
            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>
            
            {/* Footer Message */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
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

export default LoginPage;