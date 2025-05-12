//
//package com.classteam.skopjetourismguide.service;
//
//import com.classteam.skopjetourismguide.model.Place;
//import com.classteam.skopjetourismguide.model.Review;
//import com.classteam.skopjetourismguide.model.User;
//import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
//import com.classteam.skopjetourismguide.repository.PlaceRepository;
//import com.classteam.skopjetourismguide.repository.ReviewRepository;
//import com.classteam.skopjetourismguide.repository.UserRepository;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.time.ZoneOffset;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//@Service
//@Slf4j
//public class PlaceSchedulingService {
//
//    private final GoogleMapsService googleMapsService;
//    private final PlaceRepository placeRepository;
//    private final ReviewRepository reviewRepository;
//    private final UserRepository userRepository;
//
//    private static final int SEARCH_RADIUS = 12000;
//    private static final long SYSTEM_USER_ID = 2L; // ID for system-generated reviews
//
//    private final List<PlaceType> placeTypes = List.of(PlaceType.values());
//
//    @Autowired
//    public PlaceSchedulingService(GoogleMapsService googleMapsService, PlaceRepository placeRepository,
//                                  ReviewRepository reviewRepository, UserRepository userRepository) {
//        this.googleMapsService = googleMapsService;
//        this.placeRepository = placeRepository;
//        this.reviewRepository = reviewRepository;
//        this.userRepository = userRepository;
//    }
//
//    @Scheduled(fixedRate = 172800000)
//    public void fetchAndUpdatePlacesData() {
//        log.info("Starting scheduled place data update: {}", LocalDateTime.now());
//        for (PlaceType placeType : placeTypes) {
//            try {
//                String googlePlaceType = mapToGooglePlaceType(placeType);
//                String keyword = getKeywordForPlaceType(placeType);
//                updatePlacesForType(googlePlaceType, keyword, placeType);
//                Thread.sleep(5000);
//            } catch (Exception e) {
//                log.error("Error updating places for type {}: {}", placeType, e.getMessage());
//            }
//        }
//        log.info("Completed scheduled place data update: {}", LocalDateTime.now());
//    }
//
//    public void manualFetchAndUpdatePlacesData() {
//        log.info("Starting manual place data update: {}", LocalDateTime.now());
//        for (PlaceType placeType : placeTypes) {
//            try {
//                String googlePlaceType = mapToGooglePlaceType(placeType);
//                String keyword = getKeywordForPlaceType(placeType);
//                updatePlacesForType(googlePlaceType, keyword, placeType);
//                Thread.sleep(5000);
//            } catch (Exception e) {
//                log.error("Error updating places for type {}: {}", placeType, e.getMessage());
//            }
//        }
//        log.info("Completed manual place data update: {}", LocalDateTime.now());
//    }
//
//    /**
//     * Maps application-specific PlaceType to Google Maps API place types
//     *
//     * @param placeType The application PlaceType enum value
//     * @return The corresponding Google place type string
//     */
//    private String mapToGooglePlaceType(PlaceType placeType) {
//        return switch (placeType) {
//            // Cultural and Historical
//            case MUSEUMS -> "museum";
//            case HISTORICAL, LANDMARKS, ARCHAEOLOGICAL_SITE, MONUMENT -> "tourist_attraction";
//            case CULTURAL_CENTER -> "point_of_interest";
//
//            // Entertainment
//            case THEATER -> "theater";
//            case ART_GALLERY -> "art_gallery";
//            case CINEMA -> "movie_theater";
//            case NIGHTCLUB -> "night_club";
//            case GAME_CENTER -> "amusement_park";
//
//            // Natural Places
//            case NATURE, FOREST, MOUNTAIN, WATERFALL -> "natural_feature";
//            case PARKS, GARDEN, HIKING_TRAIL -> "park";
//            case VIEWPOINT -> "tourist_attraction";
//
//            // Food and Drink
//            case RESTAURANT -> "restaurant";
//            case CAFE_BAR -> "cafe";
//            case BAKERY -> "bakery";
//            case ICE_CREAM, DESSERT_SHOP -> "store";
//            case FOOD_COURT -> "restaurant";
//            case BREWERY, BAR -> "bar";
//            case WINERY -> "liquor_store";
//            case FOOD_TRUCK -> "meal_takeaway";
//
//            // Shopping
//            case MALL -> "shopping_mall";
//
//            // Accommodation
//            case HOTEL, HOSTEL, RESORT, APARTMENT -> "lodging";
//
//            // Sports and Recreation
//            case GYM -> "gym";
//            case STADIUM, TENNIS_COURT -> "stadium";
//            case SWIMMING_POOL -> "spa";
//
//            // Transportation
//            case PARKING -> "parking";
//            case AIRPORT -> "airport";
//            case TRAIN_STATION -> "train_station";
//            case BUS_STATION -> "bus_station";
//
//            // Educational
//            case SCHOOL -> "school";
//            case UNIVERSITY -> "university";
//            case LIBRARY -> "library";
//            case RESEARCH_INSTITUTE -> "university";
//
//            // Religious
//            case CHURCH -> "church";
//            case MOSQUE -> "mosque";
//            case TEMPLE -> "hindu_temple";
//            case PLACE_OF_WORSHIP -> "place_of_worship";
//
//            // Government and Services
//            case GOVERNMENT_BUILDING -> "city_hall";
//            case EMBASSY -> "embassy";
//
//            // Default case
//            case UNKNOWN  -> "point_of_interest";
//            default -> "point_of_interest";
//        };
//    }
//
//    /**
//     * Returns a keyword to refine the Google Places API search for specific place types
//     *
//     * @param placeType The application PlaceType enum value
//     * @return A keyword string or null if no specific keyword is needed
//     */
//    private String getKeywordForPlaceType(PlaceType placeType) {
//        return switch (placeType) {
//            case HISTORICAL -> "historical";
//            case LANDMARKS -> "landmark";
//            case ARCHAEOLOGICAL_SITE -> "archaeological";
//            case MONUMENT -> "monument";
//            case CULTURAL_CENTER -> "cultural";
//            case VIEWPOINT -> "viewpoint";
//            case GAME_CENTER -> "arcade";
//            case HIKING_TRAIL -> "hiking";
//            case GARDEN -> "garden";
//            case FOREST -> "forest";
//            case MOUNTAIN -> "mountain";
//            case WATERFALL -> "waterfall";
//            case ICE_CREAM -> "ice cream";
//            case DESSERT_SHOP -> "dessert";
//            case FOOD_COURT -> "food court";
//            case BREWERY -> "brewery";
//            case WINERY -> "winery";
//            case FOOD_TRUCK -> "food truck";
//            case HOTEL -> "hotel";
//            case HOSTEL -> "hostel";
//            case RESORT -> "resort";
//            case APARTMENT -> "apartment";
//            case SWIMMING_POOL -> "swimming pool";
//            case TENNIS_COURT -> "tennis";
//            case RESEARCH_INSTITUTE -> "research";
//            case GOVERNMENT_BUILDING -> "government";
//            default -> null;
//        };
//    }
//
//    private void updatePlacesForType(String googlePlaceType, String keyword, PlaceType placeType) {
//        log.info("Updating places for type: {} (Google type: {}, keyword: {})",
//                placeType, googlePlaceType, keyword != null ? keyword : "none");
//
//        // Get places from Google Maps API with appropriate type and keyword
//        Map<String, Object> placesResult = googleMapsService.getPlacesInSkopjeMultiPoint(googlePlaceType, SEARCH_RADIUS, keyword);
//
//        if (placesResult.containsKey("results")) {
//            List<Map<String, Object>> results = (List<Map<String, Object>>) placesResult.get("results");
//            log.info("Retrieved {} places for type: {}", results.size(), placeType);
//
//            for (Map<String, Object> placeData : results) {
//                try {
//                    String placeId = (String) placeData.get("place_id");
//                    if (placeId == null || placeId.isBlank()) {
//                        log.warn("Skipping place: missing place_id");
//                        continue;
//                    }
//
//                    Optional<Place> existingPlace = placeRepository.findByGooglePlaceId(placeId);
//                    Place place = existingPlace.orElseGet(Place::new);
//                    place.setGooglePlaceId(placeId);
//                    updatePlaceFromGoogleData(place, placeData, placeType);
//
//                    if (place.getName() == null || place.getLatitude() == null || place.getLongitude() == null) {
//                        log.warn("Skipping invalid place (missing name or coordinates): {}", placeId);
//                        continue;
//                    }
//
//                    Place savedPlace = placeRepository.save(place);
//
//                    // Fetch and update reviews for this place
//                    fetchAndSaveReviewsForPlace(savedPlace.getGooglePlaceId(), savedPlace);
//
//                } catch (Exception e) {
//                    log.error("Error processing place entry: {}", e.getMessage());
//                }
//            }
//        } else {
//            log.warn("No results found for place type: {} (Google type: {})", placeType, googlePlaceType);
//            if (placesResult.containsKey("error")) {
//                log.error("Error response: {}", placesResult.get("error"));
//            }
//        }
//    }
//
//    private void updatePlaceFromGoogleData(Place place, Map<String, Object> placeData, PlaceType placeType) {
//        if (placeData.containsKey("name")) {
//            place.setName((String) placeData.get("name"));
//        }
//
//        place.setPlaceType(placeType);
//
//        // Check for editorial_summary for place description
//        if (placeData.containsKey("editorial_summary")) {
//            Map<String, Object> editorialSummary = (Map<String, Object>) placeData.get("editorial_summary");
//            if (editorialSummary.containsKey("overview")) {
//                String overview = (String) editorialSummary.get("overview");
//                // Only update description if it's empty or null
//                if (place.getDescription() == null || place.getDescription().isEmpty()) {
//                    place.setDescription(overview);
//                }
//            }
//        }
//        if (placeData.containsKey("vicinity")) {
//            place.setVicinity((String) placeData.get("vicinity"));
//            if (place.getAddress() == null) {
//                place.setAddress((String) placeData.get("vicinity"));
//            }
//        }
//
//        if (placeData.containsKey("formatted_address")) {
//            place.setAddress((String) placeData.get("formatted_address"));
//        }
//
//        if (placeData.containsKey("rating")) {
//            place.setAverageRating(((Number) placeData.get("rating")).floatValue());
//        }
//
//        if (placeData.containsKey("user_ratings_total")) {
//            place.setUserRatingsTotal(((Number) placeData.get("user_ratings_total")).intValue());
//        }
//
//        if (placeData.containsKey("geometry") && ((Map)placeData.get("geometry")).containsKey("location")) {
//            Map<String, Object> location = (Map<String, Object>) ((Map)placeData.get("geometry")).get("location");
//            place.setLatitude(((Number) location.get("lat")).doubleValue());
//            place.setLongitude(((Number) location.get("lng")).doubleValue());
//        }
//
//        if (placeData.containsKey("opening_hours")) {
//            Map<String, Object> openingHours = (Map<String, Object>) placeData.get("opening_hours");
//            if (openingHours.containsKey("open_now")) {
//                place.setOpenNow((Boolean) openingHours.get("open_now"));
//            }
//        }
//
//        if (placeData.containsKey("photos") && !((List)placeData.get("photos")).isEmpty()) {
//            Map<String, Object> photo = (Map<String, Object>) ((List)placeData.get("photos")).get(0);
//            if (photo.containsKey("photo_reference")) {
//                place.setPhotoReference((String) photo.get("photo_reference"));
//            }
//        }
//
//        if (placeData.containsKey("website")) {
//            place.setWebsiteURL((String) placeData.get("website"));
//        }
//
//        if (placeData.containsKey("formatted_phone_number")) {
//            place.setPhoneNumber((String) placeData.get("formatted_phone_number"));
//        }
//    }
//
//    private void fetchAndSaveReviewsForPlace(String placeId, Place place) {
//        try {
//            Map<String, Object> placeDetails = googleMapsService.getPlaceDetails(placeId);
//
//            if (placeDetails.containsKey("result") && ((Map)placeDetails.get("result")).containsKey("reviews")) {
//                List<Map<String, Object>> reviewsData = (List<Map<String, Object>>) ((Map)placeDetails.get("result")).get("reviews");
//
//                try {
//                    // Get the system user for Google reviews
//                    User systemUser = userRepository.findById(SYSTEM_USER_ID)
//                            .orElseThrow(() -> new RuntimeException("System user not found"));
//
//                    // Process each review
//                    for (Map<String, Object> reviewData : reviewsData) {
//                        String authorName = (String) reviewData.get("author_name");
//                        String reviewText = (String) reviewData.get("text");
//                        int rating = ((Number) reviewData.get("rating")).intValue();
//                        long timeStamp = ((Number) reviewData.get("time")).longValue();
//
//                        // Create a unique identifier for this Google review
//                        String reviewIdentifier = placeId + "_" + authorName + "_" + timeStamp;
//
//                        // Check if we already have this review
//                        boolean reviewExists = place.getReviews().stream()
//                                .anyMatch(r -> r.getComment() != null &&
//                                        r.getComment().startsWith("[Google Review by " + authorName + "]"));
//
//                        if (!reviewExists) {
//                            Review review = new Review();
//                            review.setRating(rating);
//                            review.setComment("[Google Review by " + authorName + "] " + reviewText);
//                            review.setTimestamp(LocalDateTime.ofEpochSecond(timeStamp, 0, ZoneOffset.UTC));
//                            review.setUser(systemUser);
//                            review.setPlace(place);
//
//                            place.getReviews().add(review);
//                        }
//                    }
//
//                    // Save the place with its new reviews
//                    placeRepository.save(place);
//                    log.info("Added {} reviews for place: {}", reviewsData.size(), place.getName());
//                } catch (Exception e) {
//                    log.error("Error processing reviews for place {}: {}", placeId, e.getMessage());
//                }
//            }
//        } catch (Exception e) {
//            log.error("Error fetching reviews for place {}: {}", placeId, e.getMessage());
//        }
//    }
//}
//
