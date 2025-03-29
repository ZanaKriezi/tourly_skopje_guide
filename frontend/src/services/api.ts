import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API service
const ApiService = {
  // Test connection to backend
  testConnection: async () => {
    try {
      const response = await apiClient.get('/test');
      return response.data;
    } catch (error) {
      console.error('API connection error:', error);
      throw error;
    }
  },

  // Get all places
  getPlaces: async (category?: string) => {
    try {
      const response = await apiClient.get('/places', {
        params: { category },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  // Future methods to add:
  // - getPlaceDetails
  // - searchPlaces
  // - createTour
  // - getUserPreferences
  // - etc.
};

export default ApiService;