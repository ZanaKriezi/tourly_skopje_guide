// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaces } from '../context/PlacesContext';
import { PlaceType } from '../types/places';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PlaceCard from '../components/places/PlaceCard';
import { 
  MapPin, 
  Coffee, 
  Utensils, 
  Building, 
  Landmark, 
  Search, 
  ChevronRight,
  Star,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';

// Import hero image - make sure to have this image in your assets folder
import heroImage from '../assets/skopjeArtBridge.jpg'; // You may need to update this path

const HomePage: React.FC = () => {
  const { places, loading, loadPlaces } = usePlaces();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  // Categories for the discover section
  const categories = [
    { 
      id: PlaceType.HISTORICAL, 
      name: 'Historical', 
      icon: <Landmark className="h-6 w-6" />, 
      color: 'bg-orange-100 text-orange-600',
      description: 'Explore ancient landmarks and historical sites'
    },
    { 
      id: PlaceType.RESTAURANT, 
      name: 'Restaurants', 
      icon: <Utensils className="h-6 w-6" />, 
      color: 'bg-blue-100 text-blue-600',
      description: 'Discover local and international cuisine'
    },
    { 
      id: PlaceType.CAFE_BAR, 
      name: 'Cafés & Bars', 
      icon: <Coffee className="h-6 w-6" />, 
      color: 'bg-green-100 text-green-600',
      description: 'Enjoy the vibrant café culture'
    },
    { 
      id: PlaceType.PARKS, 
      name: 'Parks', 
      icon: <MapPin className="h-6 w-6" />, 
      color: 'bg-emerald-100 text-emerald-600',
      description: 'Relax in beautiful green spaces'
    },
    { 
      id: PlaceType.MUSEUMS, 
      name: 'Museums', 
      icon: <Building className="h-6 w-6" />, 
      color: 'bg-purple-100 text-purple-600',
      description: 'Immerse yourself in art and culture'
    }
  ];

  // Features for the "why choose us" section
  const features = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'Curated Experiences',
      description: 'Our local experts handpick the best places to ensure quality recommendations.'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: 'Save Time',
      description: 'Efficiently plan your trip with personalized itineraries in minutes.'
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Flexible Planning',
      description: 'Customize your tour based on your interests, budget, and schedule.'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-500" />,
      title: 'Affordable',
      description: 'Create amazing experiences that fit your budget with local insights.'
    }
  ];

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/places/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen min-h-[600px] max-h-[800px] flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Discover the Beauty of Skopje
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore the vibrant capital of North Macedonia with its rich history, stunning architecture, and amazing cuisine
          </p>
          
          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto bg-white/20 backdrop-blur-md p-2 rounded-full shadow-lg mb-8"
          >
            <div className="flex">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search for places, attractions, restaurants..."
                  className="w-full px-6 py-3 rounded-full border-none focus:ring-0 bg-transparent text-white placeholder-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-full transition shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  <span>Search</span>
                </div>
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/places">
              <Button 
                variant="primary" 
                size="lg"
                className="rounded-full shadow-button hover:shadow-button-hover"
              >
                Explore Places
              </Button>
            </Link>
            <Link to="/tours">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Create Tour
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md">
            <ChevronRight className="h-6 w-6 text-white transform rotate-90" />
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-4">Discover Skopje</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the diverse attractions and experiences that Skopje has to offer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/places?type=${category.id}`}
                className="group"
              >
                <div className="h-full bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  <div className={`p-6 ${category.color} flex items-center justify-center`}>
                    <div className="h-12 w-12 flex items-center justify-center">
                      {category.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary-600 transition">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-4">Featured Places</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most popular attractions and experiences in Skopje
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading featured places..." />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {places.slice(0, 6).map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/places">
                  <Button 
                    variant="primary"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    View All Places
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-4">Why Choose Tourly</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make your travel experience in Skopje smooth and memorable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-gray-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="lg:w-2/3">
              <h2 className="font-display font-bold text-3xl mb-4">Ready to Explore Skopje?</h2>
              <p className="text-gray-300 max-w-2xl">
                Create your personalized tour and discover the best of Skopje according to your preferences and interests.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <Link to="/tours">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="rounded-full shadow-lg hover:shadow-xl"
                >
                  Create Your Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;