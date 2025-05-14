// src/pages/TourEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTours } from '../context/ToursContext';
import { usePlaces } from '../context/PlacesContext';
import { useAuth } from '../context/AuthContext';
import { TourCreateDTO } from '../types/tours';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PreferenceForm from '../components/tours/PreferenceForm';
import PlaceCard from '../components/places/PlaceCard';

const TourEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    selectedTour, 
    loading: tourLoading, 
    error: tourError, 
    loadTourById, 
    updateTour,
    addPlaceToTour,
    removePlaceFromTour,
    clearError: clearTourError
  } = useTours();
  
  const { 
    places, 
    loading: placesLoading, 
    loadPlaces 
  } = usePlaces();
  
  const { user } = useAuth();
  
  const [title, setTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreferenceForm, setShowPreferenceForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<'details' | 'places'>('details');
  
  // Load tour details on component mount
  useEffect(() => {
    if (id) {
      loadTourById(Number(id));
    }
  }, [id, loadTourById]);
  
  // Load available places
  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);
  
  // Set initial form values when tour data is loaded
  useEffect(() => {
    if (selectedTour) {
      setTitle(selectedTour.title);
    }
  }, [selectedTour]);
  
  // Check if the current user owns this tour
  const isOwner = user && selectedTour && user.id === selectedTour.userId;
  
  // Handle back button
  const handleBack = (): void => {
    navigate(`/tours/${id}`);
  };
  
  // Handle saving the tour
  const handleSaveTour = async (): Promise<void> => {
    if (!id || !selectedTour) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const tourData: TourCreateDTO = {
        title,
        preferenceId: selectedTour.preferenceId
      };
      
      await updateTour(Number(id), tourData);
      
      // Navigate back to tour details after saving
      navigate(`/tours/${id}`);
    } catch (err) {
        console.error('Failed to save tour:', err);
      setSaveError('Failed to save tour. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding a place to the tour
  const handleAddPlace = async (placeId: number): Promise<void> => {
    if (!id) return;
    
    try {
      await addPlaceToTour(Number(id), placeId);
    } catch (err) {
      console.error('Failed to add place to tour:', err);
    }
  };
  
  // Handle removing a place from the tour
  const handleRemovePlace = async (placeId: number): Promise<void> => {
    if (!id) return;
    
    try {
      await removePlaceFromTour(Number(id), placeId);
    } catch (err) {
      console.error('Failed to remove place from tour:', err);
    }
  };
  
  // Check if a place is already in the tour
  const isPlaceInTour = (placeId: number): boolean => {
    return selectedTour?.places.some(p => p.id === placeId) || false;
  };

  if (tourLoading) {
    return (
      <Container>
        <LoadingSpinner size="lg" text="Loading tour details..." />
      </Container>
    );
  }

  if (tourError) {
    return (
      <Container>
        <ErrorMessage 
          message={tourError} 
          onRetry={() => {
            clearTourError();
            if (id) loadTourById(Number(id));
          }} 
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/tours')}
        >
          ← Back to Tours
        </Button>
      </Container>
    );
  }

  if (!selectedTour) {
    return (
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/tours')}
          >
            ← Back to Tours
          </Button>
        </div>
      </Container>
    );
  }

  // If user is not the owner, redirect to tour details
  if (!isOwner) {
    navigate(`/tours/${id}`);
    return null;
  }

  return (
    <Container>
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={() => navigate('/tours')} className="hover:text-primary">
          Tours
        </button>
        <span className="mx-2">›</span>
        <button onClick={handleBack} className="hover:text-primary">
          {selectedTour.title}
        </button>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Edit</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Tour</h1>
      
      {/* Edit Mode Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium ${editMode === 'details' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setEditMode('details')}
          >
            Tour Details
          </button>
          <button
            className={`py-3 px-6 font-medium ${editMode === 'places' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setEditMode('places')}
          >
            Manage Places
          </button>
        </div>
        
        {/* Tour Details Form */}
        {editMode === 'details' && (
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="title" className="block font-medium mb-1">
                Tour Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Tour Preferences</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferenceForm(!showPreferenceForm)}
                >
                  {showPreferenceForm ? 'Hide Preferences' : 'Edit Preferences'}
                </Button>
              </div>
              
              {showPreferenceForm ? (
                <PreferenceForm
                  // We would need to load the preference details separately
                  onSave={(preference) => {
                    console.log('Preference saved:', preference);
                    setShowPreferenceForm(false);
                  }}
                  onCancel={() => setShowPreferenceForm(false)}
                />
              ) : (
                <p className="text-gray-600">
                  {selectedTour.preferenceDescription || 'No preference description.'}
                </p>
              )}
            </div>
            
            {saveError && (
              <div className="text-red-600 mb-4">
                {saveError}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTour}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Manage Places */}
        {editMode === 'places' && (
          <div className="p-6">
            <h3 className="font-medium mb-4">Current Places in Tour</h3>
            
            {selectedTour.places.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-600">
                  No places added to this tour yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedTour.places.map((place) => (
                  <div key={place.id} className="relative">
                    <PlaceCard place={place} />
                    <button
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      onClick={() => handleRemovePlace(place.id)}
                      title="Remove from tour"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <h3 className="font-medium mb-4">Add Places to Tour</h3>
            
            {placesLoading ? (
              <LoadingSpinner size="md" text="Loading places..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => (
                  <div key={place.id} className="relative">
                    <PlaceCard place={place} />
                    {!isPlaceInTour(place.id) && (
                      <button
                        className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full hover:bg-green-700"
                        onClick={() => handleAddPlace(place.id)}
                        title="Add to tour"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline"
                onClick={handleBack}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TourEditPage;