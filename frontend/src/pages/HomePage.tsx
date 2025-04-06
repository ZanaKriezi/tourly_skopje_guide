import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { LoadingState } from '../types/common';
import PageContainer from '../components/layout/PageContainer';
import FeatureCard from '../components/features/FeatureCard';
import ConnectionStatus from '../components/features/ConnectionStatus';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Updated to use the nested structure
        const response = await ApiService.system.testConnection();
        setConnectionStatus(response);
        setLoadingState('succeeded');
      } catch {
        setError('Failed to connect to backend');
        setLoadingState('failed');
      }
    };

    checkConnection();
  }, []);

  const features = [
    {
      title: 'Discover Places',
      description: 'Find attractions, restaurants, shopping malls, and entertainment spots across Skopje.'
    },
    {
      title: 'Personalized Tours',
      description: isAuthenticated 
        ? "Create your own custom tours based on your preferences and budget."
        : "Get AI-generated tour recommendations based on your preferences and budget."
    },
    {
      title: 'User Reviews',
      description: isAuthenticated 
        ? "Read and leave reviews about places you visit in Skopje."
        : "Read reviews about places in Skopje from other travelers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="font-montserrat text-3xl font-bold text-text mb-4">Discover Skopje</h2>
          <p className="font-inter text-lg mb-6 text-text">
            Explore the beautiful city of Skopje, Macedonia. Find attractions, restaurants, and create personalized tours.
          </p>
          
          {/* Backend Connection Status */}
          <ConnectionStatus
            status={connectionStatus}
            state={loadingState}
            error={error}
          />
          
          <div className="mt-8">
            <Button 
              variant="primary" 
              size="lg"
            >
              Explore Skopje
            </Button>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12">
          <h2 className="font-montserrat text-2xl font-bold text-text mb-8 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </PageContainer>
    </div>
  );
};

export default HomePage;