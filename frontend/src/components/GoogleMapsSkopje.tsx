import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

interface Place {
  id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GoogleMapsSkopjeProps {
  apiKey: string;
}

const GoogleMapsSkopje: React.FC<GoogleMapsSkopjeProps> = ({ apiKey }) => {
  const [center, setCenter] = useState({ lat: 41.9981, lng: 21.4254 });
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeType, setPlaceType] = useState<string>('restaurant');
  const [radius, setRadius] = useState<number>(1000);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customIcon, setCustomIcon] = useState<google.maps.Icon | undefined>(undefined);

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  useEffect(() => {
    fetchPlaces();
  }, [placeType, radius]);

  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/maps/places?type=${placeType}&radius=${radius}`);
      if (response.data.results) {
        setPlaces(response.data.results);
      } else {
        setPlaces([]);
        if (response.data.error) {
          setError(response.data.error);
        }
      }
    } catch (err) {
      setError('Failed to fetch places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaceType(e.target.value);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseInt(e.target.value));
  };

  return (
    <div>
      <h2>Skopje, North Macedonia - Points of Interest</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Place Type:
          <select
            value={placeType}
            onChange={handlePlaceTypeChange}
            style={{ marginLeft: '10px', marginRight: '20px' }}
          >
            <option value="restaurant">Restaurants</option>
            <option value="cafe">Cafes</option>
            <option value="museum">Museums</option>
            <option value="park">Parks</option>
            <option value="tourist_attraction">Tourist Attractions</option>
            <option value="hotel">Hotels</option>
          </select>
        </label>

        <label>
          Radius (meters):
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={radius}
            onChange={handleRadiusChange}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{radius}m</span>
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          onLoad={() => {
            // Safely set the custom icon once Google Maps is available
            const icon = {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            };
            setCustomIcon(icon);
          }}
        >
          {/* Central Skopje marker with custom icon */}
          {customIcon && (
            <Marker
              position={center}
              icon={customIcon}
            />
          )}

          {/* Nearby places markers */}
          {places.map(place => (
            <Marker
              key={place.id}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {/* Info window when a place is selected */}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.geometry.location.lat,
                lng: selectedPlace.geometry.location.lng
              }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.vicinity}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <div style={{ marginTop: '20px' }}>
        <h3>Found Places: {places.length}</h3>
        <ul>
          {places.map(place => (
            <li key={place.id}>
              <strong>{place.name}</strong> - {place.vicinity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoogleMapsSkopje;
