import React from 'react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { Place } from '../../types/places';
import PlaceCard from '../places/PlaceCard';

interface FeaturedPlacesProps {
  title: string;
  subtitle?: string;
  places: Place[];
  limit?: number;
  showViewAll?: boolean;
  activeCategory?: string;
}

const FeaturedPlaces: React.FC<FeaturedPlacesProps> = ({
  title,
  subtitle,
  places,
  limit = 6,
  showViewAll = true,
  activeCategory
}) => {
  // Filter places by category if active category is set
  const filteredPlaces = activeCategory 
    ? places.filter(place => place.placeType === activeCategory)
    : places;
  
  // Limit the number of places to display
  const displayedPlaces = filteredPlaces.slice(0, limit);
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-montserrat font-bold text-3xl text-text mb-3">{title}</h2>
          {subtitle && (
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {displayedPlaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPlaces.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
            
            {showViewAll && filteredPlaces.length > limit && (
              <div className="mt-10 text-center">
                <Link to={activeCategory ? `/places?type=${activeCategory}` : '/places'}>
                  <Button variant="primary">
                    View All Places
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="font-inter text-gray-600 mb-6">
              No places found in this category.
            </p>
            <Link to="/places">
              <Button variant="primary">
                View All Places
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPlaces;