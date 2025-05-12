import React, { useState, useEffect } from 'react';
import { LoadingState } from '../types/common';
import { Place, PlaceType } from '../types/places';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeroSection from '../components/home/HeroSection';
import CategorySection, { Category } from '../components/home/CategorySection';
import FeaturedPlaces from '../components/home/FeaturedPlaces';
import LocalTips from '../components/home/LocalTips';
import Reviews from '../components/home/Reviews';

// Import dummy data and mock API
import { mockApiService } from '../data/dummyData';

// Import hero image
import heroImage from '../assets/skopjeArtBridge.jpg';

const HomePage: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Category icons
  const AttractionsIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="22" x2="12" y2="15.5" />
      <polyline points="22 8.5 12 15.5 2 8.5" />
      <line x1="12" y1="2" x2="12" y2="8.5" />
    </svg>
  );

  const RestaurantsIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );

  const CafesIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    </svg>
  );

  const ShoppingIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );

  // Local tips icons
  const TipIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  const EventsIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  // Define categories
  const categories: Category[] = [
    { id: PlaceType.HISTORICAL, name: 'Attractions', icon: <AttractionsIcon />, link: '/places?type=HISTORICAL' },
    { id: PlaceType.RESTAURANT, name: 'Restaurants', icon: <RestaurantsIcon />, link: '/places?type=RESTAURANT' },
    { id: PlaceType.CAFE_BAR, name: 'Cafés & Bars', icon: <CafesIcon />, link: '/places?type=CAFE_BAR' },
    { id: PlaceType.MALL, name: 'Shopping', icon: <ShoppingIcon />, link: '/places?type=MALL' }
  ];

  // Define local tips
  const localTips = [
    {
      id: 'tip1',
      title: 'Best Time to Visit',
      content: 'Spring (April-June) and fall (September-October) offer the most pleasant weather for exploring Skopje.',
      icon: <TipIcon />,
      link: '/tips/best-time'
    },
    {
      id: 'tip2',
      title: 'Upcoming Events',
      content: 'Don\'t miss the annual Skopje Summer Festival with music performances throughout the city center.',
      icon: <EventsIcon />,
      link: '/events'
    }
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoadingState('loading');
        // Use mock API service instead of real API
        const data = await mockApiService.places.getAll();
        setPlaces(data);
        setLoadingState('succeeded');
      } catch (error) {
        console.error('Error fetching places:', error);
        setLoadingState('failed');
      }
    };

    fetchPlaces();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(prevCategory => 
      prevCategory === categoryId ? '' : categoryId
    );
  };

  if (loadingState === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroImage}
        title="Discover Skopje"
        subtitle="Explore the vibrant capital of Macedonia with its rich history, stunning architecture, and amazing food"
        ctaText="Explore Now"
        ctaLink="/places"
      />

      {/* Category Navigation */}
      <CategorySection
        categories={categories}
        title="Explore By Category"
        subtitle="Find the best places in Skopje by category"
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Featured Places */}
      <FeaturedPlaces
        title="Featured Places"
        subtitle="Discover the most popular attractions and experiences in Skopje"
        places={places}
        activeCategory={activeCategory}
      />

      {/* Local Tips Section */}
      <LocalTips
        tips={localTips}
        title="Local Tips"
        subtitle="Insights from locals to enhance your Skopje experience"
      />

      <Reviews/>
    </div>
  );
};

export default HomePage;