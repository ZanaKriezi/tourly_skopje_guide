package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.PageResponseDTO;
import com.classteam.skopjetourismguide.dto.PlaceDTO;
import com.classteam.skopjetourismguide.dto.PlaceDetailDTO;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import com.classteam.skopjetourismguide.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlacesService {

    private final PlaceRepository placeRepository;
    private final ReviewRepository reviewRepository;
    private final GoogleMapsService googleMapsService;
    private final DtoMapper dtoMapper;

    @Autowired
    public PlacesService(PlaceRepository placeRepository,
                         ReviewRepository reviewRepository,
                         GoogleMapsService googleMapsService,
                         DtoMapper dtoMapper) {
        this.placeRepository = placeRepository;
        this.reviewRepository = reviewRepository;
        this.googleMapsService = googleMapsService;
        this.dtoMapper = dtoMapper;
    }

    // Get all places
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // Get place by ID - original method
    public Optional<Place> getPlaceById(Long id) {
        return placeRepository.findById(id);
    }

    // Get places by type - original method
    public List<Place> getPlacesByType(PlaceType placeType) {
        return placeRepository.findByPlaceType(placeType);
    }

    // Get top rated places by type - original method
    public List<Place> getTopRatedPlacesByType(PlaceType placeType) {
        return placeRepository.findTop10ByPlaceTypeOrderByAverageRatingDesc(placeType);
    }

    // Get places by rating - original method
    public List<Place> getPlacesByMinimumRating(Float rating) {
        return placeRepository.findByAverageRatingGreaterThanEqual(rating);
    }

    // Search places by name - original method
    public List<Place> searchPlacesByName(String name) {
        return placeRepository.findByNameContainingIgnoreCase(name);
    }

    // Search places by address - original method
    public List<Place> searchPlacesByAddress(String address) {
        return placeRepository.findByAddressContainingIgnoreCase(address);
    }

    // Search places by description - original method
    public List<Place> searchPlacesByDescription(String description) {
        return placeRepository.findByDescriptionContainingIgnoreCase(description);
    }

    // Search places by sentiment tag - original method
    public List<Place> searchPlacesBySentimentTag(String sentimentTag) {
        return placeRepository.findBySentimentTagContainingIgnoreCase(sentimentTag);
    }

    // Fetch places from Google Maps API and save to database - original method
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

    // Create a new place - original method
    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    // Update an existing place - original method
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

    // Delete a place - original method
    public boolean deletePlace(Long id) {
        if (placeRepository.existsById(id)) {
            placeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Helper method to map Google place types to our PlaceType enum - original method
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
                return PlaceType.LANDMARKS; // Default value
        }
    }

    //
    // NEW PAGINATED METHODS WITH DTO SUPPORT - UPDATED FOR RATING SORTING
    //

    // Get all places with pagination - ensure default sorting by rating
    @Transactional(readOnly = true)
    public PageResponseDTO<PlaceDTO> getAllPlacesPaginated(Pageable pageable) {
        // Ensure default sorting if not provided
        if (pageable.getSort().isEmpty()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "averageRating")
            );
        }

        Page<Place> placesPage = placeRepository.findAll(pageable);

        List<PlaceDTO> placeDTOs = placesPage.getContent().stream()
                .map(dtoMapper::toPlaceDto)
                .collect(Collectors.toList());

        return dtoMapper.toPageResponse(placesPage, placeDTOs);
    }

    // Get place by ID with limited reviews
    @Transactional(readOnly = true)
    public Optional<PlaceDetailDTO> getPlaceWithLimitedReviews(Long id, int reviewLimit) {
        // First, get the place with minimal data
        Optional<Place> placeOpt = placeRepository.findPlaceWithMinimalData(id);

        if (placeOpt.isPresent()) {
            Place place = placeOpt.get();

            // Use the JPA repository method instead of the native query
            List<Review> recentReviews = reviewRepository.findByPlaceIdOrderByTimestampDesc(
                    id, PageRequest.of(0, reviewLimit));

            // Get review count
            int reviewCount = placeRepository.countReviewsByPlaceId(id);

            // Map to DTO
            PlaceDetailDTO dto = dtoMapper.toPlaceDetailDto(place, recentReviews);
            dto.setReviewCount(reviewCount);

            return Optional.of(dto);
        }

        return Optional.empty();
    }

    // Get places by type with pagination - ensure default sorting by rating
    @Transactional(readOnly = true)
    public PageResponseDTO<PlaceDTO> getPlacesByTypePaginated(PlaceType placeType, Pageable pageable) {
        // Ensure default sorting if not provided
        if (pageable.getSort().isEmpty()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "averageRating")
            );
        }

        Page<Place> placesPage = placeRepository.findByPlaceType(placeType, pageable);

        List<PlaceDTO> placeDTOs = placesPage.getContent().stream()
                .map(dtoMapper::toPlaceDto)
                .collect(Collectors.toList());

        return dtoMapper.toPageResponse(placesPage, placeDTOs);
    }

    // Search places by name with pagination - ensure default sorting by rating
    @Transactional(readOnly = true)
    public PageResponseDTO<PlaceDTO> searchPlacesByNamePaginated(String name, Pageable pageable) {
        // Ensure default sorting if not provided
        if (pageable.getSort().isEmpty()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "averageRating")
            );
        }

        Page<Place> placesPage = placeRepository.findByNameContainingIgnoreCase(name, pageable);

        List<PlaceDTO> placeDTOs = placesPage.getContent().stream()
                .map(dtoMapper::toPlaceDto)
                .collect(Collectors.toList());

        return dtoMapper.toPageResponse(placesPage, placeDTOs);
    }
}