// src/components/HomePage.tsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await ApiService.testConnection();
        setConnectionStatus(response);
        setIsLoading(false);
      } catch {
        setError('Failed to connect to backend');
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="font-montserrat text-3xl font-bold text-text mb-4">Discover Skopje</h2>
          <p className="font-inter text-lg mb-6 text-text">
            Explore the beautiful city of Skopje, Macedonia. Find attractions, restaurants, and create personalized tours.
          </p>
          
          {/* Backend Connection Status */}
          <div className="my-4">
            <h3 className="font-poppins text-xl mb-2 text-text">Backend Status:</h3>
            {isLoading ? (
              <div className="bg-neutral p-4 rounded animate-pulse">Checking connection...</div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                {error}
              </div>
            ) : (
              <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded">
                {connectionStatus}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-poppins font-medium hover:bg-secondary transition-colors">
              Explore Skopje
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="font-montserrat text-2xl font-bold text-text mb-8 text-center">Key Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-poppins text-xl font-semibold text-primary mb-3">Discover Places</h3>
            <p className="font-inter text-text">
              Find attractions, restaurants, shopping malls, and entertainment spots across Skopje.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-poppins text-xl font-semibold text-primary mb-3">Personalized Tours</h3>
            <p className="font-inter text-text">
              {isAuthenticated 
                ? "Create your own custom tours based on your preferences and budget."
                : "Get AI-generated tour recommendations based on your preferences and budget."
              }
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-poppins text-xl font-semibold text-primary mb-3">User Reviews</h3>
            <p className="font-inter text-text">
              {isAuthenticated 
                ? "Read and leave reviews about places you visit in Skopje."
                : "Read reviews about places in Skopje from other travelers."
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;