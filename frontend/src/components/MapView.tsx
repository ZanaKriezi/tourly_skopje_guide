// MapView.tsx - Create this new component to display the map
import React, { useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

interface PlaceLocation {
  lat: number;
  lng: number;
}

interface Geometry {
  location: PlaceLocation;
}

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  geometry?: Geometry;
  types?: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface MapViewProps {
  places: GooglePlace[];
  selectedPlace: GooglePlace | null;
  onPlaceSelect: (place: GooglePlace) => void;
}

interface MapContainerProps extends MapViewProps {
  apiKey: string;
}

// This component will display Google Maps with places
const MapView: React.FC<MapViewProps> = ({ places, selectedPlace, onPlaceSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Create map centered on Skopje
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 41.9981, lng: 21.4254 }, // Skopje coordinates
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;

    // Clean up function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstanceRef.current || !places.length || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    const infoWindow = new window.google.maps.InfoWindow();

    // Create markers for all places
    places.forEach(place => {
      if (!place.geometry || !place.geometry.location) return;
      
      const position = {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      };
      
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: place.name,
        animation: window.google.maps.Animation.DROP
      });
      
      marker.addListener('click', () => {
        // Show info window when marker is clicked
        infoWindow.setContent(`
          <div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
            <p>${place.vicinity || ''}</p>
            <p>${place.rating ? `Rating: ${place.rating}★` : ''}</p>
          </div>
        `);
        infoWindow.open(mapInstanceRef.current, marker);
        
        // Call the selection handler
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });
      
      markersRef.current.push(marker);
    });
  }, [places, onPlaceSelect]);

  // Update map when a place is selected
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace || !selectedPlace.geometry || !window.google) return;
    
    const position = {
      lat: selectedPlace.geometry.location.lat,
      lng: selectedPlace.geometry.location.lng
    };
    
    mapInstanceRef.current.panTo(position);
    mapInstanceRef.current.setZoom(15);
    
    // Find the marker for the selected place and animate it
    const marker = markersRef.current.find(m => 
      m.getPosition()?.lat() === position.lat && m.getPosition()?.lng() === position.lng
    );
    
    if (marker) {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 1500);
    }
  }, [selectedPlace]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />;
};

// Wrapper component that loads the Google Maps API
const MapContainer: React.FC<MapContainerProps> = ({ apiKey, places, selectedPlace, onPlaceSelect }) => {
  return (
    <Wrapper apiKey={apiKey}>
      <MapView 
        places={places} 
        selectedPlace={selectedPlace} 
        onPlaceSelect={onPlaceSelect}
      />
    </Wrapper>
  );
};

export default MapContainer;