// src/pages/MapPage.tsx
import React from 'react';
import GoogleMapsSkopje from '../components/GoogleMapsSkopje';

interface MapPageProps {
  apiKey: string;
}

const MapPage: React.FC<MapPageProps> = ({ apiKey }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Skopje Maps Explorer</h1>
      <p className="mb-4">
        Explore places of interest in Skopje, North Macedonia. Use the filters below to find different types of locations.
      </p>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <GoogleMapsSkopje apiKey={apiKey} />
      </div>
    </div>
  );
};

export default MapPage;