package com.classteam.skopjetourismguide.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import com.classteam.skopjetourismguide.dto.PlaceDTO;
import com.classteam.skopjetourismguide.dto.PreferenceDTO;
import com.classteam.skopjetourismguide.dto.TourCreateDTO;
import com.classteam.skopjetourismguide.dto.TourDTO;
import com.classteam.skopjetourismguide.exception.PlaceNotFoundException;
import com.classteam.skopjetourismguide.exception.PreferenceNotFoundException;
import com.classteam.skopjetourismguide.exception.TourNotFoundException;
import com.classteam.skopjetourismguide.exception.UserNotFoundException;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Preference;
import com.classteam.skopjetourismguide.model.Tour;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.enumerations.AttractionType;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.model.enumerations.TourLength;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import com.classteam.skopjetourismguide.repository.PreferenceRepository;
import com.classteam.skopjetourismguide.repository.TourRepository;
import com.classteam.skopjetourismguide.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ToursService {

    private static final Logger logger = LoggerFactory.getLogger(ToursService.class);

    private final TourRepository tourRepository;
    private final PlaceRepository placeRepository;
    private final PreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final OpenAIClient openAIClient;
    private final String deploymentName;

    // List of place types to exclude from tour recommendations
    private final Set<PlaceType> excludedPlaceTypes = Set.of(
            PlaceType.SCHOOL, PlaceType.UNIVERSITY, PlaceType.LIBRARY, PlaceType.RESEARCH_INSTITUTE,
            PlaceType.CHURCH, PlaceType.MOSQUE, PlaceType.TEMPLE, PlaceType.SYNAGOGUE, PlaceType.PLACE_OF_WORSHIP,
            PlaceType.GOVERNMENT_BUILDING, PlaceType.EMBASSY, PlaceType.POLICE, PlaceType.POST_OFFICE,
            PlaceType.BANK, PlaceType.HOSPITAL, PlaceType.PHARMACY, PlaceType.AQUARIUM, PlaceType.BEAUTY_SALON,
            PlaceType.CEMETERY, PlaceType.COURTHOUSE, PlaceType.PET_STORE, PlaceType.TOURIST_INFORMATION,
            PlaceType.UNKNOWN
    );

    public ToursService(
            TourRepository tourRepository,
            PlaceRepository placeRepository,
            PreferenceRepository preferenceRepository,
            UserRepository userRepository,
            OpenAIClient openAIClient,
            @Value("${azure.openai.deployment}") String deploymentName) {
        this.tourRepository = tourRepository;
        this.placeRepository = placeRepository;
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
        this.openAIClient = openAIClient;
        this.deploymentName = deploymentName;
    }

    /**
     * Get all tours
     */
    public List<TourDTO> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a tour by ID
     */
    public TourDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException(id));
        return mapTourToDTO(tour);
    }

    /**
     * Get tours by user
     */
    public List<TourDTO> getToursByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return tourRepository.findByUser(user).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get tours by preference
     */
    public List<TourDTO> getToursByPreference(Long preferenceId) {
        Preference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new PreferenceNotFoundException(preferenceId));
        return tourRepository.findByPreference(preference).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search tours by title
     */
    public List<TourDTO> searchToursByTitle(String title) {
        return tourRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new tour
     */
    @Transactional
    public TourDTO createTour(TourCreateDTO tourCreateDTO) {
        logger.info("Creating tour with title: {}", tourCreateDTO.getTitle());

        User user = userRepository.findById(tourCreateDTO.getUserId())
                .orElseThrow(() -> new UserNotFoundException(tourCreateDTO.getUserId()));

        Preference preference;
        if (tourCreateDTO.getPreferenceId() != null) {
            preference = preferenceRepository.findById(tourCreateDTO.getPreferenceId())
                    .orElseThrow(() -> new PreferenceNotFoundException(tourCreateDTO.getPreferenceId()));
        } else {
            // Create a new preference if one wasn't specified
            preference = createNewPreference(tourCreateDTO.getPreferenceDTO(), user);
        }

        Tour tour = new Tour();
        tour.setTitle(tourCreateDTO.getTitle());
        tour.setUser(user);
        tour.setPreference(preference);

        List<Place> places;
        if (tourCreateDTO.getPlaceIds() != null && !tourCreateDTO.getPlaceIds().isEmpty()) {
            // Use user-selected places
            places = new ArrayList<>();
            for (Long placeId : tourCreateDTO.getPlaceIds()) {
                Place place = placeRepository.findById(placeId)
                        .orElseThrow(() -> new PlaceNotFoundException(placeId));
                places.add(place);
            }
            logger.info("Using user-selected places for tour. Count: {}", places.size());
        } else {
            // Auto-generate tour places based on preferences
            places = generateRecommendedPlaces(preference);
            logger.info("Generated AI-recommended places for tour. Count: {}", places.size());
        }

        tour.setPlaces(places);
        tour = tourRepository.save(tour);

        logger.info("Tour created successfully with ID: {}", tour.getId());

        return mapTourToDTO(tour);
    }

    /**
     * Update an existing tour
     */
    @Transactional
    public TourDTO updateTour(Long id, TourCreateDTO tourUpdateDTO) {
        logger.info("Updating tour with ID: {}", id);

        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException(id));

        if (tourUpdateDTO.getTitle() != null) {
            tour.setTitle(tourUpdateDTO.getTitle());
        }

        if (tourUpdateDTO.getPreferenceId() != null) {
            Preference preference = preferenceRepository.findById(tourUpdateDTO.getPreferenceId())
                    .orElseThrow(() -> new PreferenceNotFoundException(tourUpdateDTO.getPreferenceId()));
            tour.setPreference(preference);
        }

        if (tourUpdateDTO.getPlaceIds() != null) {
            List<Place> places = new ArrayList<>();
            for (Long placeId : tourUpdateDTO.getPlaceIds()) {
                Place place = placeRepository.findById(placeId)
                        .orElseThrow(() -> new PlaceNotFoundException(placeId));
                places.add(place);
            }
            tour.setPlaces(places);
        }

        tour = tourRepository.save(tour);
        logger.info("Tour updated successfully");

        return mapTourToDTO(tour);
    }

    /**
     * Delete a tour
     */
    @Transactional
    public void deleteTour(Long id) {
        logger.info("Deleting tour with ID: {}", id);

        if (!tourRepository.existsById(id)) {
            throw new TourNotFoundException(id);
        }
        tourRepository.deleteById(id);

        logger.info("Tour deleted successfully");
    }

    /**
     * Add a place to a tour
     */
    @Transactional
    public TourDTO addPlaceToTour(Long tourId, Long placeId) {
        logger.info("Adding place ID: {} to tour ID: {}", placeId, tourId);

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new PlaceNotFoundException(placeId));

        tour.getPlaces().add(place);
        tour = tourRepository.save(tour);

        logger.info("Place added to tour successfully");

        return mapTourToDTO(tour);
    }

    /**
     * Remove a place from a tour
     */
    @Transactional
    public TourDTO removePlaceFromTour(Long tourId, Long placeId) {
        logger.info("Removing place ID: {} from tour ID: {}", placeId, tourId);

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));

        tour.getPlaces().removeIf(place -> place.getId().equals(placeId));
        tour = tourRepository.save(tour);

        logger.info("Place removed from tour successfully");

        return mapTourToDTO(tour);
    }

    /**
     * Create a new preference from DTO
     */
    private Preference createNewPreference(PreferenceDTO preferenceDTO, User user) {
        logger.info("Creating new preference for user ID: {}", user.getId());

        Preference preference = new Preference();
        preference.setDescription(preferenceDTO.getDescription());
        preference.setTourLength(preferenceDTO.getTourLength());
        preference.setBudgetLevel(preferenceDTO.getBudgetLevel());
        preference.setIncludeShoppingMalls(preferenceDTO.getIncludeShoppingMalls());
        preference.setFoodTypePreferences(preferenceDTO.getFoodTypePreferences());
        preference.setDrinkTypePreferences(preferenceDTO.getDrinkTypePreferences());
        preference.setAttractionTypePreferences(preferenceDTO.getAttractionTypePreferences());
        preference.setUser(user);

        return preferenceRepository.save(preference);
    }

    /**
     * Generate recommended places for a tour
     */
    private List<Place> generateRecommendedPlaces(Preference preference) {
        logger.info("Generating AI-recommended places for preference: {}", preference.getDescription());

        // Step 1: Get eligible places based on preferences
        List<Place> eligiblePlaces = getEligiblePlaces(preference);

        if (eligiblePlaces.isEmpty()) {
            logger.warn("No eligible places found for preference: {}", preference.getDescription());
            return new ArrayList<>();
        }

        // Step 2: Use AI to create an optimized tour if we have enough eligible places
        if (eligiblePlaces.size() >= 5) {
            List<Place> aiRecommendedPlaces = generateAIRecommendedTour(preference, eligiblePlaces);
            if (!aiRecommendedPlaces.isEmpty()) {
                logger.info("Successfully generated AI-recommended tour with {} places", aiRecommendedPlaces.size());
                return aiRecommendedPlaces;
            }
            // If AI recommendation fails, fall back to algorithm
            logger.warn("AI tour generation failed, falling back to algorithm");
        } else {
            logger.info("Not enough eligible places for AI recommendation, using algorithm");
        }

        // Step 3: Fallback to algorithmic generation if AI fails or not enough places
        List<Place> algorithmicPlaces = fallbackTourGeneration(preference);
        logger.info("Generated {} places using fallback algorithm", algorithmicPlaces.size());
        return algorithmicPlaces;
    }

    /**
     * Get eligible places based on user preferences
     */
    private List<Place> getEligiblePlaces(Preference preference) {
        List<Place> eligiblePlaces = new ArrayList<>();

        // Add places based on attraction preferences
        if (preference.getAttractionTypePreferences() != null && !preference.getAttractionTypePreferences().isEmpty()) {
            for (AttractionType attractionType : preference.getAttractionTypePreferences()) {
                PlaceType placeType = mapAttractionTypeToPlaceType(attractionType);
                if (placeType != null) {
                    List<Place> placesOfType = placeRepository.findByPlaceTypeOrderByAverageRatingDesc(placeType);
                    eligiblePlaces.addAll(placesOfType);
                }
            }
        }

        // Add food places if preferences exist
        if (preference.getFoodTypePreferences() != null && !preference.getFoodTypePreferences().isEmpty()) {
            List<Place> restaurants = placeRepository.findByPlaceType(PlaceType.RESTAURANT);
            eligiblePlaces.addAll(restaurants);
        }

        // Add drink places if preferences exist
        if (preference.getDrinkTypePreferences() != null && !preference.getDrinkTypePreferences().isEmpty()) {
            List<Place> cafeBars = placeRepository.findByPlaceType(PlaceType.CAFE_BAR);
            eligiblePlaces.addAll(cafeBars);

            List<Place> bars = placeRepository.findByPlaceType(PlaceType.BAR);
            eligiblePlaces.addAll(bars);
        }

        // Add shopping malls if preference set
        if (Boolean.TRUE.equals(preference.getIncludeShoppingMalls())) {
            List<Place> malls = placeRepository.findByPlaceType(PlaceType.MALL);
            eligiblePlaces.addAll(malls);
        }

        // Filter places
        return eligiblePlaces.stream()
                // Exclude certain place types
                .filter(place -> !excludedPlaceTypes.contains(place.getPlaceType()))
                // Only include places with ratings above 3.0
                .filter(place -> place.getAverageRating() == null || place.getAverageRating() >= 3.0f)
                // Only include places with at least one review
                .filter(place -> place.getUserRatingsTotal() == null || place.getUserRatingsTotal() > 0)
                .collect(Collectors.toList());
    }

    /**
     * Map attraction type to place type
     */
    private PlaceType mapAttractionTypeToPlaceType(AttractionType attractionType) {
        return switch (attractionType) {
            case HISTORICAL -> PlaceType.HISTORICAL;
            case MUSEUMS -> PlaceType.MUSEUMS;
            case NATURE -> PlaceType.NATURE;
            case PARKS -> PlaceType.PARKS;
            case LANDMARKS -> PlaceType.LANDMARKS;
        };
    }

    /**
     * Generate an AI-recommended tour based on preferences and eligible places
     */
    private List<Place> generateAIRecommendedTour(Preference preference, List<Place> eligiblePlaces) {
        try {
            logger.info("Starting AI tour generation with {} eligible places", eligiblePlaces.size());

            // Step 1: Prepare place data for the AI
            StringBuilder placesInfoBuilder = new StringBuilder();
            Map<Long, Place> placeIdMap = new HashMap<>();

            for (Place place : eligiblePlaces) {
                Long placeId = place.getId();
                placeIdMap.put(placeId, place);

                placesInfoBuilder.append("ID: ").append(placeId)
                        .append(", Name: ").append(place.getName())
                        .append(", Type: ").append(place.getPlaceType())
                        .append(", Rating: ").append(place.getAverageRating() != null ? place.getAverageRating() : "N/A")
                        .append(", Reviews: ").append(place.getUserRatingsTotal() != null ? place.getUserRatingsTotal() : 0)
                        .append(", Sentiment: ").append(place.getSentimentTag() != null ? place.getSentimentTag() : "None")
                        .append("\n");
            }

            // Step 2: Calculate max places based on tour length
            int maxPlaces = getMaxPlacesForTourLength(preference.getTourLength());

            // Step 3: Create the prompt for AI
            String prompt = String.format(
                    "You are a tour planning expert for Skopje, North Macedonia. Create an optimal tour with up to %d places based on these preferences:\n\n" +
                            "Tour Length: %s\n" +
                            "Budget Level: %s\n" +
                            "Attraction Types: %s\n" +
                            "Food Preferences: %s\n" +
                            "Drink Preferences: %s\n" +
                            "Include Shopping Malls: %s\n\n" +
                            "Available Places:\n%s\n\n" +
                            "Consider higher ratings, number of reviews, and create a balanced mix of places that match the preferences.\n" +
                            "Reply with ONLY a comma-separated list of place IDs to include in the tour (e.g., 1,15,23,47,52). No other explanation.",
                    maxPlaces,
                    preference.getTourLength(),
                    preference.getBudgetLevel(),
                    preference.getAttractionTypePreferences() != null
                            ? preference.getAttractionTypePreferences().stream().map(Enum::name).collect(Collectors.joining(", "))
                            : "None",
                    preference.getFoodTypePreferences() != null
                            ? preference.getFoodTypePreferences().stream().map(Enum::name).collect(Collectors.joining(", "))
                            : "None",
                    preference.getDrinkTypePreferences() != null
                            ? preference.getDrinkTypePreferences().stream().map(Enum::name).collect(Collectors.joining(", "))
                            : "None",
                    preference.getIncludeShoppingMalls(),
                    placesInfoBuilder.toString()
            );

            logger.debug("Sending prompt to OpenAI for tour generation");

            // Step 4: Get AI response
            String response = getCompletionFromOpenAI(prompt);

            if (response != null && !response.isBlank()) {
                logger.debug("Received response from OpenAI: {}", response);

                // Step 5: Parse the response to get place IDs
                List<Place> recommendedPlaces = new ArrayList<>();
                String[] idStrings = response.split(",");

                for (String idStr : idStrings) {
                    try {
                        Long placeId = Long.parseLong(idStr.trim());
                        Place place = placeIdMap.get(placeId);
                        if (place != null) {
                            recommendedPlaces.add(place);
                        } else {
                            logger.warn("Place ID {} from AI response not found in eligible places", placeId);
                        }
                    } catch (NumberFormatException e) {
                        logger.warn("Invalid place ID in AI response: {}", idStr);
                    }
                }

                if (!recommendedPlaces.isEmpty()) {
                    // If we have too many places, trim to the maximum
                    if (recommendedPlaces.size() > maxPlaces) {
                        recommendedPlaces = recommendedPlaces.subList(0, maxPlaces);
                    }

                    return recommendedPlaces;
                } else {
                    logger.warn("No valid places found in AI response");
                }
            } else {
                logger.warn("Empty or null response from OpenAI");
            }
        } catch (Exception e) {
            logger.error("Error generating AI tour recommendations: {}", e.getMessage(), e);
        }

        return Collections.emptyList();
    }

    /**
     * Fallback tour generation using algorithm
     */
    private List<Place> fallbackTourGeneration(Preference preference) {
        logger.info("Using fallback tour generation algorithm for preference: {}", preference.getDescription());

        List<Place> recommendedPlaces = new ArrayList<>();

        // Get places based on attraction types
        if (preference.getAttractionTypePreferences() != null && !preference.getAttractionTypePreferences().isEmpty()) {
            for (AttractionType attractionType : preference.getAttractionTypePreferences()) {
                PlaceType placeType = mapAttractionTypeToPlaceType(attractionType);
                if (placeType != null) {
                    List<Place> placesOfType = placeRepository.findByPlaceTypeOrderByAverageRatingDesc(placeType);

                    // Filter and limit to top 2 places per type
                    List<Place> filteredPlaces = placesOfType.stream()
                            .filter(place -> !excludedPlaceTypes.contains(place.getPlaceType()))
                            .filter(place -> place.getAverageRating() == null || place.getAverageRating() >= 3.0f)
                            .limit(2)
                            .collect(Collectors.toList());

                    recommendedPlaces.addAll(filteredPlaces);
                }
            }
        }

        // Add food places
        if (preference.getFoodTypePreferences() != null && !preference.getFoodTypePreferences().isEmpty()) {
            List<Place> restaurants = placeRepository.findByPlaceType(PlaceType.RESTAURANT);

            List<Place> filteredRestaurants = restaurants.stream()
                    .filter(place -> place.getAverageRating() == null || place.getAverageRating() >= 3.0f)
                    .limit(2)
                    .collect(Collectors.toList());

            recommendedPlaces.addAll(filteredRestaurants);
        }

        // Add drink places
        if (preference.getDrinkTypePreferences() != null && !preference.getDrinkTypePreferences().isEmpty()) {
            List<Place> cafeBars = placeRepository.findByPlaceType(PlaceType.CAFE_BAR);

            List<Place> filteredCafeBars = cafeBars.stream()
                    .filter(place -> place.getAverageRating() == null || place.getAverageRating() >= 3.0f)
                    .limit(2)
                    .collect(Collectors.toList());

            recommendedPlaces.addAll(filteredCafeBars);
        }

        // Add shopping malls if needed
        if (Boolean.TRUE.equals(preference.getIncludeShoppingMalls())) {
            List<Place> malls = placeRepository.findByPlaceType(PlaceType.MALL);

            List<Place> filteredMalls = malls.stream()
                    .filter(place -> place.getAverageRating() == null || place.getAverageRating() >= 3.0f)
                    .limit(1)
                    .collect(Collectors.toList());

            recommendedPlaces.addAll(filteredMalls);
        }

        // Limit total places based on tour length
        int maxPlaces = getMaxPlacesForTourLength(preference.getTourLength());

        if (recommendedPlaces.size() > maxPlaces) {
            recommendedPlaces = recommendedPlaces.subList(0, maxPlaces);
        }

        return recommendedPlaces;
    }

    /**
     * Get maximum number of places based on tour length
     */
    private int getMaxPlacesForTourLength(TourLength tourLength) {
        return switch (tourLength) {
            case HALF_DAY -> 3;
            case FULL_DAY -> 5;
            case TWO_THREE_DAYS -> 8;
            case FOUR_SEVEN_DAYS -> 12;
        };
    }

    /**
     * Get completion from OpenAI
     */
    private String getCompletionFromOpenAI(String prompt) {
        List<ChatRequestMessage> messages = new ArrayList<>();
        messages.add(new ChatRequestSystemMessage("You are a tour planning assistant for Skopje, North Macedonia."));
        messages.add(new ChatRequestUserMessage(prompt));

        ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
        options.setMaxTokens(500);
        options.setTemperature(0.5);

        ChatCompletions completions = openAIClient.getChatCompletions(deploymentName, options);

        if (!completions.getChoices().isEmpty()) {
            return completions.getChoices().get(0).getMessage().getContent();
        }

        return null;
    }

    /**
     * Map Tour entity to TourDTO
     */
    private TourDTO mapTourToDTO(Tour tour) {
        TourDTO dto = new TourDTO();
        dto.setId(tour.getId());
        dto.setTitle(tour.getTitle());
        dto.setDateCreated(tour.getDateCreated());
        dto.setUserId(tour.getUser().getId());
        dto.setUserName(tour.getUser().getUsername());
        dto.setPreferenceId(tour.getPreference().getId());
        dto.setPreferenceDescription(tour.getPreference().getDescription());

        List<PlaceDTO> placeDTOs = tour.getPlaces().stream()
                .map(place -> {
                    PlaceDTO placeDTO = new PlaceDTO();
                    placeDTO.setId(place.getId());
                    placeDTO.setName(place.getName());
                    placeDTO.setPlaceType(place.getPlaceType());
                    placeDTO.setDescription(place.getDescription());
                    placeDTO.setLatitude(place.getLatitude());
                    placeDTO.setLongitude(place.getLongitude());
                    placeDTO.setAddress(place.getAddress());
                    placeDTO.setAverageRating(place.getAverageRating());
                    placeDTO.setPhotoReference(place.getPhotoReference());
                    placeDTO.setReviewCount(place.getUserRatingsTotal());
                    return placeDTO;
                })
                .collect(Collectors.toList());

        dto.setPlaces(placeDTOs);
        return dto;
    }
}