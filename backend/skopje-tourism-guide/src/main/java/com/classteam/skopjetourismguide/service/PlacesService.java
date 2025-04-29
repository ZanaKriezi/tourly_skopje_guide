package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlacesService {

    private final PlaceRepository placeRepository;
    private final GoogleMapsService googleMapsService;

    @Autowired
    public PlacesService(PlaceRepository placeRepository, GoogleMapsService googleMapsService) {
        this.placeRepository = placeRepository;
        this.googleMapsService = googleMapsService;
    }

    // Get all places
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // Get place by ID
    public Optional<Place> getPlaceById(Long id) {
        return placeRepository.findById(id);
    }

    // Get places by type
    public List<Place> getPlacesByType(PlaceType placeType) {
        return placeRepository.findByPlaceType(placeType);
    }

    // Get top rated places by type
    public List<Place> getTopRatedPlacesByType(PlaceType placeType) {
        return placeRepository.findTop10ByPlaceTypeOrderByAverageRatingDesc(placeType);
    }

    // Get places by rating
    public List<Place> getPlacesByMinimumRating(Float rating) {
        return placeRepository.findByAverageRatingGreaterThanEqual(rating);
    }

    // Search places by name
    public List<Place> searchPlacesByName(String name) {
        return placeRepository.findByNameContainingIgnoreCase(name);
    }

    // Search places by address
    public List<Place> searchPlacesByAddress(String address) {
        return placeRepository.findByAddressContainingIgnoreCase(address);
    }

    // Search places by description
    public List<Place> searchPlacesByDescription(String description) {
        return placeRepository.findByDescriptionContainingIgnoreCase(description);
    }

    // Search places by sentiment tag
    public List<Place> searchPlacesBySentimentTag(String sentimentTag) {
        return placeRepository.findBySentimentTagContainingIgnoreCase(sentimentTag);
    }

    // Fetch places from Google Maps API and save to database
    public List<Place> fetchAndSavePlacesFromGoogle(String type, int radius) {
        Map<String, Object> googleResponse = googleMapsService.getPlacesInSkopje(type, radius);
        List<Place> savedPlaces = new ArrayList<>();

        if (googleResponse.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) googleResponse.get("results");

            for (Map<String, Object> result : results) {
                String googlePlaceId = (String) result.get("place_id");

                // Check if place already exists in our database
                Optional<Place> existingPlace = placeRepository.findByGooglePlaceId(googlePlaceId);

                if (existingPlace.isPresent()) {
                    savedPlaces.add(existingPlace.get());
                    continue;
                }

                Place newPlace = new Place();
                newPlace.setName((String) result.get("name"));
                newPlace.setGooglePlaceId(googlePlaceId);

                // Set place type based on the Google Maps type
                if (type != null) {
                    newPlace.setPlaceType(mapGoogleTypeToPlaceType(type));
                }

                // Set location data
                if (result.containsKey("geometry") && ((Map<String, Object>) result.get("geometry")).containsKey("location")) {
                    Map<String, Object> location = (Map<String, Object>) ((Map<String, Object>) result.get("geometry")).get("location");
                    newPlace.setLatitude((Double) location.get("lat"));
                    newPlace.setLongitude((Double) location.get("lng"));
                }

                // Set other properties from Google result
                newPlace.setVicinity((String) result.get("vicinity"));

                if (result.containsKey("photos") && !((List<Map<String, Object>>) result.get("photos")).isEmpty()) {
                    Map<String, Object> photo = ((List<Map<String, Object>>) result.get("photos")).get(0);
                    newPlace.setPhotoReference((String) photo.get("photo_reference"));
                }

                if (result.containsKey("opening_hours")) {
                    Map<String, Object> openingHours = (Map<String, Object>) result.get("opening_hours");
                    if (openingHours.containsKey("open_now")) {
                        newPlace.setOpenNow((Boolean) openingHours.get("open_now"));
                    }
                }

                if (result.containsKey("user_ratings_total")) {
                    newPlace.setUserRatingsTotal(((Number) result.get("user_ratings_total")).intValue());
                }

                if (result.containsKey("rating")) {
                    newPlace.setAverageRating(((Number) result.get("rating")).floatValue());
                }

                // Set address to vicinity if address is null
                if (newPlace.getAddress() == null) {
                    newPlace.setAddress(newPlace.getVicinity());
                }

                // Save place to database
                Place savedPlace = placeRepository.save(newPlace);
                savedPlaces.add(savedPlace);
            }
        }

        return savedPlaces;
    }

    // Create a new place
    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    // Update an existing place
    public Optional<Place> updatePlace(Long id, Place placeDetails) {
        return placeRepository.findById(id).map(place -> {
            if (placeDetails.getName() != null) {
                place.setName(placeDetails.getName());
            }
            if (placeDetails.getDescription() != null) {
                place.setDescription(placeDetails.getDescription());
            }
            if (placeDetails.getPlaceType() != null) {
                place.setPlaceType(placeDetails.getPlaceType());
            }
            if (placeDetails.getLatitude() != null) {
                place.setLatitude(placeDetails.getLatitude());
            }
            if (placeDetails.getLongitude() != null) {
                place.setLongitude(placeDetails.getLongitude());
            }
            if (placeDetails.getAddress() != null) {
                place.setAddress(placeDetails.getAddress());
            }
            if (placeDetails.getPhoneNumber() != null) {
                place.setPhoneNumber(placeDetails.getPhoneNumber());
            }
            if (placeDetails.getWebsiteURL() != null) {
                place.setWebsiteURL(placeDetails.getWebsiteURL());
            }
            if (placeDetails.getSocialMedia() != null) {
                place.setSocialMedia(placeDetails.getSocialMedia());
            }
            if (placeDetails.getAverageRating() != null) {
                place.setAverageRating(placeDetails.getAverageRating());
            }
            if (placeDetails.getSentimentTag() != null) {
                place.setSentimentTag(placeDetails.getSentimentTag());
            }
            return placeRepository.save(place);
        });
    }

    // Delete a place
    public boolean deletePlace(Long id) {
        if (placeRepository.existsById(id)) {
            placeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Helper method to map Google place types to our PlaceType enum
    private PlaceType mapGoogleTypeToPlaceType(String googleType) {
        switch (googleType.toLowerCase()) {
            case "tourist_attraction":
            case "landmark":
                return PlaceType.LANDMARKS;
            case "museum":
                return PlaceType.MUSEUMS;
            case "park":
                return PlaceType.PARKS;
            case "natural_feature":
                return PlaceType.NATURE;
            case "restaurant":
                return PlaceType.RESTAURANT;
            case "cafe":
            case "bar":
                return PlaceType.CAFE_BAR;
            case "shopping_mall":
                return PlaceType.MALL;
            case "historic":
            case "historical_site":
                return PlaceType.HISTORICAL;
            default:
                return PlaceType.LANDMARKS; // Default value since you don't have OTHER
        }
    }
}