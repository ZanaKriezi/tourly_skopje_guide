import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest } from '../../types/auth';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (name: string, value: string | number | undefined): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
      setIsLoading(true);
      setServerError(null);
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
      setServerError(
        axiosError.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {serverError && (
        <Alert type="error" message={serverError} className="mb-4" />
      )}
      
      {success && (
        <Alert type="success" message={success} className="mb-4" />
      )}
      
      {/* Required Fields */}
      <Input
        label="Username *"
        id="username"
        name="username"
        value={formData.username}
        onChange={(e) => handleChange('username', e.target.value)}
        disabled={isLoading}
        error={errors.username}
        required
      />
      
      <Input
        label="Email *"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        disabled={isLoading}
        error={errors.email}
        required
      />
      
      <Input
        label="Password *"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        disabled={isLoading}
        error={errors.password}
        required
      />
      
      <Input
        label="Confirm Password *"
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        disabled={isLoading}
        error={errors.confirmPassword}
        required
      />
      
      {/* Optional Fields */}
      <Input
        label="First Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        disabled={isLoading}
      />
      
      <Input
        label="Last Name"
        id="surname"
        name="surname"
        value={formData.surname}
        onChange={(e) => handleChange('surname', e.target.value)}
        disabled={isLoading}
      />
      
      <Input
        label="Age"
        type="number"
        id="age"
        name="age"
        value={formData.age === undefined ? '' : formData.age}
        onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
        disabled={isLoading}
        min={1}
        max={120}
      />
      
      <Select
        label="Gender"
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={(value) => handleChange('gender', value)}
        disabled={isLoading}
        options={[
          { value: '', label: 'Select Gender' },
          { value: 'MALE', label: 'Male' },
          { value: 'FEMALE', label: 'Female' },
          { value: 'OTHER', label: 'Other' }
        ]}
      />
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;