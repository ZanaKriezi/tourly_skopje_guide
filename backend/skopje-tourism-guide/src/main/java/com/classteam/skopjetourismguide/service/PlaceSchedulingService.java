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
@Slf4j
public class PlaceSchedulingService {

    private final GoogleMapsService googleMapsService;
    private final PlaceRepository placeRepository;

    private static final int SEARCH_RADIUS = 12000;

    private final List<PlaceType> placeTypes = List.of(PlaceType.values());

    @Autowired
    public PlaceSchedulingService(GoogleMapsService googleMapsService, PlaceRepository placeRepository) {
        this.googleMapsService = googleMapsService;
        this.placeRepository = placeRepository;
    }

    @Scheduled(fixedRate = 172800000)
    public void fetchAndUpdatePlacesData() {
        log.info("Starting scheduled place data update: {}", LocalDateTime.now());
        for (PlaceType placeType : placeTypes) {
            try {
                String googlePlaceType = mapToGooglePlaceType(placeType);
                updatePlacesForType(googlePlaceType, placeType);
                Thread.sleep(5000);
            } catch (Exception e) {
                log.error("Error updating places for type {}: {}", placeType, e.getMessage());
            }
        }
        log.info("Completed scheduled place data update: {}", LocalDateTime.now());
    }

    public void manualFetchAndUpdatePlacesData() {
        log.info("Starting manual place data update: {}", LocalDateTime.now());
        for (PlaceType placeType : placeTypes) {
            try {
                String googlePlaceType = mapToGooglePlaceType(placeType);
                updatePlacesForType(googlePlaceType, placeType);
                Thread.sleep(5000);
            } catch (Exception e) {
                log.error("Error updating places for type {}: {}", placeType, e.getMessage());
            }
        }
        log.info("Completed manual place data update: {}", LocalDateTime.now());
    }

    private String mapToGooglePlaceType(PlaceType placeType) {
        return switch (placeType) {
            case RESTAURANT -> "restaurant";
            case CAFE_BAR -> "cafe";
            case BAKERY -> "bakery";
            case ICE_CREAM, DESSERT_SHOP -> "store";
            case FOOD_COURT -> "food";
            case BREWERY -> "bar";
            case WINERY -> "liquor_store";
            case FOOD_TRUCK -> "meal_takeaway";
            case MUSEUMS -> "museum";
            case ART_GALLERY -> "art_gallery";
            case CINEMA -> "movie_theater";
            case THEATER -> "theater";
            case CULTURAL_CENTER -> "point_of_interest";
            case HISTORICAL, MONUMENT, LANDMARKS, ARCHAEOLOGICAL_SITE -> "tourist_attraction";
            case MALL -> "shopping_mall";
            case PARKS, GARDEN -> "park";
            case NATURE, FOREST, MOUNTAIN, WATERFALL -> "natural_feature";
            case HIKING_TRAIL -> "trail";
            case VIEWPOINT -> "point_of_interest";
            case HOTEL, HOSTEL, RESORT, APARTMENT -> "lodging";
            case NIGHTCLUB -> "night_club";
            case GAME_CENTER -> "amusement_center";
            case ZOO -> "zoo";
            case GYM -> "gym";
            case STADIUM, TENNIS_COURT, SWIMMING_POOL -> "stadium";
            case PARKING -> "parking";
            case AIRPORT -> "airport";
            case TRAIN_STATION -> "train_station";
            case BUS_STATION -> "bus_station";
            case SCHOOL -> "school";
            case UNIVERSITY -> "university";
            case LIBRARY -> "library";
            case RESEARCH_INSTITUTE -> "point_of_interest";
            case CHURCH -> "church";
            case MOSQUE -> "mosque";
            case TEMPLE -> "place_of_worship";
            case PLACE_OF_WORSHIP -> "place_of_worship";
            case GOVERNMENT_BUILDING -> "city_hall";
            case EMBASSY -> "embassy";
            default -> "point_of_interest";
        };
    }

    private void updatePlacesForType(String googlePlaceType, PlaceType placeType) {
        log.info("Updating places for type: {}", placeType);

        Map<String, Object> placesResult = googleMapsService.getPlacesInSkopjeMultiPoint(googlePlaceType, SEARCH_RADIUS);

        if (placesResult.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) placesResult.get("results");
            log.info("Retrieved {} places for type: {}", results.size(), placeType);

            for (Map<String, Object> placeData : results) {
                try {
                    String placeId = (String) placeData.get("place_id");
                    if (placeId == null || placeId.isBlank()) {
                        log.warn("Skipping place: missing place_id");
                        continue;
                    }

                    Optional<Place> existingPlace = placeRepository.findByGooglePlaceId(placeId);
                    Place place = existingPlace.orElseGet(Place::new);
                    place.setGooglePlaceId(placeId);
                    updatePlaceFromGoogleData(place, placeData, placeType);

                    if (place.getName() == null || place.getLatitude() == null || place.getLongitude() == null) {
                        log.warn("Skipping invalid place (missing name or coordinates): {}", placeId);
                        continue;
                    }

                    placeRepository.save(place);
                } catch (Exception e) {
                    log.error("Error processing place entry: {}", e.getMessage());
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
        if (placeData.containsKey("name")) {
            place.setName((String) placeData.get("name"));
        }

        place.setPlaceType(placeType);

        if (placeData.containsKey("vicinity")) {
            place.setVicinity((String) placeData.get("vicinity"));
            if (place.getAddress() == null) {
                place.setAddress((String) placeData.get("vicinity"));
            }
        }

        if (placeData.containsKey("formatted_address")) {
            place.setAddress((String) placeData.get("formatted_address"));
        }

        if (placeData.containsKey("rating")) {
            place.setAverageRating(((Number) placeData.get("rating")).floatValue());
        }

        if (placeData.containsKey("user_ratings_total")) {
            place.setUserRatingsTotal(((Number) placeData.get("user_ratings_total")).intValue());
        }

        if (placeData.containsKey("geometry") && ((Map)placeData.get("geometry")).containsKey("location")) {
            Map<String, Object> location = (Map<String, Object>) ((Map)placeData.get("geometry")).get("location");
            place.setLatitude(((Number) location.get("lat")).doubleValue());
            place.setLongitude(((Number) location.get("lng")).doubleValue());
        }

        if (placeData.containsKey("opening_hours")) {
            Map<String, Object> openingHours = (Map<String, Object>) placeData.get("opening_hours");
            if (openingHours.containsKey("open_now")) {
                place.setOpenNow((Boolean) openingHours.get("open_now"));
            }
        }

        if (placeData.containsKey("photos") && !((List)placeData.get("photos")).isEmpty()) {
            Map<String, Object> photo = (Map<String, Object>) ((List)placeData.get("photos")).get(0);
            if (photo.containsKey("photo_reference")) {
                place.setPhotoReference((String) photo.get("photo_reference"));
            }
        }

        if (placeData.containsKey("website")) {
            place.setWebsiteURL((String) placeData.get("website"));
        }

        if (placeData.containsKey("formatted_phone_number")) {
            place.setPhoneNumber((String) placeData.get("formatted_phone_number"));
        }
    }
}
