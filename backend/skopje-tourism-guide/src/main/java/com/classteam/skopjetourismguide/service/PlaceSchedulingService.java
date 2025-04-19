package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j  // Lombok annotation to add logging capabilities
public class PlaceSchedulingService {

    private final GoogleMapsService googleMapsService;
    private final PlaceRepository placeRepository;

    // Define place types to fetch - adjust these based on what's most relevant for Skopje
    private final List<PlaceType> placeTypes = List.of(
            PlaceType.RESTAURANT,
            PlaceType.CAFE_BAR,
            PlaceType.MUSEUMS,
            PlaceType.HISTORICAL,
            PlaceType.MALL,
            PlaceType.PARKS,
            PlaceType.NATURE,
            PlaceType.LANDMARKS
    );

    @Autowired
    public PlaceSchedulingService(GoogleMapsService googleMapsService, PlaceRepository placeRepository) {
        this.googleMapsService = googleMapsService;
        this.placeRepository = placeRepository;
    }

    // Run every 48 hours (48 hours in milliseconds = 48 * 60 * 60 * 1000)
    @Scheduled(fixedRate = 172800000)
    public void fetchAndUpdatePlacesData() {
        log.info("Starting scheduled place data update: {}", LocalDateTime.now());

        for (PlaceType placeType : placeTypes) {
            try {
                // Map your enum to Google's place type string
                String googlePlaceType = mapToGooglePlaceType(placeType);
                updatePlacesForType(googlePlaceType, placeType);
                // Small delay to avoid hitting rate limits
                Thread.sleep(2000);
            } catch (Exception e) {
                log.error("Error updating places for type {}: {}", placeType, e.getMessage());
            }
        }

        log.info("Completed scheduled place data update: {}", LocalDateTime.now());
    }

    private String mapToGooglePlaceType(PlaceType placeType) {
        return switch (placeType) {
            case RESTAURANT -> "restaurant";
            case CAFE_BAR -> "cafe";
            case MUSEUMS -> "museum";
            case HISTORICAL -> "tourist_attraction";
            case MALL -> "shopping_mall";
            case PARKS -> "park";
            case NATURE -> "natural_feature";
            case LANDMARKS -> "landmark";
        };
    }

    private void updatePlacesForType(String googlePlaceType, PlaceType placeType) {
        log.info("Updating places for type: {}", placeType);
        Map<String, Object> placesResult = googleMapsService.getPlacesInSkopje(googlePlaceType, 5000);

        if (placesResult.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) placesResult.get("results");

            for (Map<String, Object> placeData : results) {
                try {
                    String placeId = (String) placeData.get("place_id");

                    // Skip if no place ID
                    if (placeId == null) continue;

                    // Check if place already exists in DB
                    Optional<Place> existingPlace = placeRepository.findByGooglePlaceId(placeId);
                    Place place;

                    if (existingPlace.isPresent()) {
                        place = existingPlace.get();
                    } else {
                        place = new Place();
                        place.setGooglePlaceId(placeId);
                    }

                    // Update basic place data
                    updatePlaceFromGoogleData(place, placeData, placeType);

                    // Save the updated place
                    placeRepository.save(place);

                } catch (Exception e) {
                    log.error("Error processing place: {}", e.getMessage());
                }
            }
        } else {
            log.warn("No results found for place type: {}", placeType);
            if (placesResult.containsKey("error")) {
                log.error("Error response: {}", placesResult.get("error"));
            }
        }
    }

    private void updatePlaceFromGoogleData(Place place, Map<String, Object> placeData, PlaceType placeType) {
        // Update name
        if (placeData.containsKey("name")) {
            place.setName((String) placeData.get("name"));
        }

        // Set place type directly from parameter
        place.setPlaceType(placeType);

        // Update vicinity/address
        if (placeData.containsKey("vicinity")) {
            place.setVicinity((String) placeData.get("vicinity"));
            // Also use vicinity as address if address is empty
            if (place.getAddress() == null) {
                place.setAddress((String) placeData.get("vicinity"));
            }
        }

        // Update rating
        if (placeData.containsKey("rating")) {
            place.setAverageRating(((Number) placeData.get("rating")).floatValue());
        }

        // Update user ratings total
        if (placeData.containsKey("user_ratings_total")) {
            place.setUserRatingsTotal(((Number) placeData.get("user_ratings_total")).intValue());
        }

        // Update coordinates
        if (placeData.containsKey("geometry") && ((Map)placeData.get("geometry")).containsKey("location")) {
            Map<String, Object> location = (Map<String, Object>) ((Map)placeData.get("geometry")).get("location");
            place.setLatitude(((Number) location.get("lat")).doubleValue());
            place.setLongitude(((Number) location.get("lng")).doubleValue());
        }

        // Update opening hours
        if (placeData.containsKey("opening_hours")) {
            Map<String, Object> openingHours = (Map<String, Object>) placeData.get("opening_hours");
            if (openingHours.containsKey("open_now")) {
                place.setOpenNow((Boolean) openingHours.get("open_now"));
            }
        }

        // Update photo reference
        if (placeData.containsKey("photos") && !((List)placeData.get("photos")).isEmpty()) {
            Map<String, Object> photo = (Map<String, Object>) ((List)placeData.get("photos")).get(0);
            if (photo.containsKey("photo_reference")) {
                place.setPhotoReference((String) photo.get("photo_reference"));
            }
        }
    }

    // Helper method to map Google place types to your PlaceType enum
    private PlaceType mapToPlaceType(String googleType) {
        return switch (googleType.toLowerCase()) {
            case "restaurant" -> PlaceType.RESTAURANT;
            case "cafe" -> PlaceType.CAFE_BAR;
            case "museum" -> PlaceType.MUSEUMS;
            case "tourist_attraction", "historic", "monument" -> PlaceType.HISTORICAL;
            case "shopping_mall" -> PlaceType.MALL;
            case "park" -> PlaceType.PARKS;
            default -> PlaceType.LANDMARKS;
        };
    }
}