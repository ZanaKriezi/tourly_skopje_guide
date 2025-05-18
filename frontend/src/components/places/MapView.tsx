// src/components/places/MapView.tsx
import React, { useEffect, useRef } from "react";
import { PlaceDTO } from "../../types/places";
import { Wrapper } from "@googlemaps/react-wrapper";
import LoadingSpinner from "../common/LoadingSpinner";

interface MapProps {
  places: PlaceDTO[];
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedPlaceId?: number;
  onPlaceSelect?: (place: PlaceDTO) => void;
  height?: string;
}

const GoogleMapComponent: React.FC<MapProps> = ({
  places,
  center = { lat: 41.9981, lng: 21.4254 }, // Skopje's coordinates
  zoom = 13,
  selectedPlaceId,
  onPlaceSelect,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Create map instance
    const mapOptions = {
      center,
      zoom,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
    };
    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // Create info window instance
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Cleanup function
    return () => {
      // Close info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Clear all markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current.clear();
    };
  }, [center, zoom]);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstanceRef.current || !places.length || !window.google) return;

    // Close any open info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // Track IDs of new places
    const newPlaceIds = new Set(places.map((place) => place.id));

    // Remove markers for places that no longer exist
    markersRef.current.forEach((marker, id) => {
      if (!newPlaceIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    // Add markers for new places
    places.forEach((place) => {
      // Skip if place has no coordinates
      if (!place.latitude || !place.longitude) return;

      // If marker already exists, skip
      if (markersRef.current.has(place.id)) return;

      const position = {
        lat: place.latitude,
        lng: place.longitude,
      };

      // Create marker
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: place.name,
        animation: window.google.maps.Animation.DROP,
      });

      // Add click listener
      marker.addListener("click", () => {
        // Open info window
        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(`
            <div style="max-width: 200px">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${
                place.name
              }</h3>
              <p style="font-size: 12px; margin-bottom: 5px;">${
                place.address || ""
              }</p>
              <p style="font-size: 12px;">Rating: ${place.averageRating.toFixed(
                1
              )}★</p>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }

        // Call select handler
        if (onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      // Store marker
      markersRef.current.set(place.id, marker);
    });
  }, [places, onPlaceSelect]);

  // Update selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlaceId || !window.google) return;

    // Get marker for selected place
    const marker = markersRef.current.get(selectedPlaceId);
    if (!marker) return;

    // Pan to marker
    mapInstanceRef.current.panTo(marker.getPosition() as google.maps.LatLng);

    // Zoom in a bit if not already zoomed in
    if ((mapInstanceRef.current?.getZoom() ?? 0) < 14) {
      mapInstanceRef.current?.setZoom(15);
    }

    // Bounce the marker
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500);

    // Open info window
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place && infoWindowRef.current && mapInstanceRef.current) {
      infoWindowRef.current.setContent(`
        <div style="max-width: 200px">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${place.name}</h3>
          <p style="font-size: 12px; margin-bottom: 5px;">${
            place.address || ""
          }</p>
          <p style="font-size: 12px;">Rating: ${place.averageRating.toFixed(
            1
          )}★</p>
        </div>
      `);
      infoWindowRef.current.open(mapInstanceRef.current, marker);
    }
  }, [selectedPlaceId, places]);

  return <div ref={mapRef} style={{ width: "100%", height }} />;
};

// Error display for the Wrapper
const MapError: React.FC<{ error: Error }> = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <p>Error loading Google Maps: {error.message}</p>
  </div>
);

// Loading component for the Wrapper
const MapLoading: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <LoadingSpinner size="md" text="Loading map..." />
  </div>
);

interface MapViewProps {
  places: PlaceDTO[];
  selectedPlaceId?: number;
  onPlaceSelect?: (place: PlaceDTO) => void;
  height?: string;
  apiKey?: string;
}

const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlaceId,
  onPlaceSelect,
  height = "400px",
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
}) => {
  // Calculate map center based on places
  const getMapCenter = (): { lat: number; lng: number } => {
    if (!places.length) {
      return { lat: 41.9981, lng: 21.4254 }; // Default to Skopje center
    }

    // Find places with coordinates
    const placesWithCoords = places.filter(
      (place) => place.latitude && place.longitude
    );
    if (!placesWithCoords.length) {
      return { lat: 41.9981, lng: 21.4254 };
    }

    // If only one place, center on that
    if (placesWithCoords.length === 1) {
      return {
        lat: placesWithCoords[0].latitude!,
        lng: placesWithCoords[0].longitude!,
      };
    }

    // Calculate average of all coordinates
    const sumLat = placesWithCoords.reduce(
      (sum, place) => sum + place.latitude!,
      0
    );
    const sumLng = placesWithCoords.reduce(
      (sum, place) => sum + place.longitude!,
      0
    );

    return {
      lat: sumLat / placesWithCoords.length,
      lng: sumLng / placesWithCoords.length,
    };
  };

  const center = getMapCenter();

  return (
  <Wrapper
    apiKey={apiKey}
    render={(status) => {
      switch (status) {
        case "LOADING":
          return <MapLoading />;
        case "FAILURE":
          return (
            <MapError error={new Error("Failed to load Google Maps API")} />
          );
        case "SUCCESS":
          return (
            <GoogleMapComponent
              places={places}
              center={center}
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={onPlaceSelect}
              height={height}
            />
          );
        default:
          // Add a default case that returns a fallback component
          return <div>Unknown status: {status}</div>;
      }
    }}
  />
);
};

export default MapView;
