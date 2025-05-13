
package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.PlaceDTO;
import com.classteam.skopjetourismguide.model.*;
import com.classteam.skopjetourismguide.model.enumerations.*;
import com.classteam.skopjetourismguide.repository.TourRepository;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import com.classteam.skopjetourismguide.repository.PreferenceRepository;
import com.classteam.skopjetourismguide.repository.UserRepository;
import com.classteam.skopjetourismguide.dto.TourDTO;
import com.classteam.skopjetourismguide.dto.TourCreateDTO;
import com.classteam.skopjetourismguide.dto.PreferenceDTO;
import com.classteam.skopjetourismguide.exception.PlaceNotFoundException;
import com.classteam.skopjetourismguide.exception.PreferenceNotFoundException;
import com.classteam.skopjetourismguide.exception.TourNotFoundException;
import com.classteam.skopjetourismguide.exception.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ToursService {

    private final TourRepository tourRepository;
    private final PlaceRepository placeRepository;
    private final PreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    public ToursService(TourRepository tourRepository,
                       PlaceRepository placeRepository,
                       PreferenceRepository preferenceRepository,
                       UserRepository userRepository) {
        this.tourRepository = tourRepository;
        this.placeRepository = placeRepository;
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
    }

    public List<TourDTO> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    public TourDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new TourNotFoundException(id));
        return mapTourToDTO(tour);
    }

    public List<TourDTO> getToursByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return tourRepository.findByUser(user).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    public List<TourDTO> getToursByPreference(Long preferenceId) {
        Preference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new PreferenceNotFoundException(preferenceId));
        return tourRepository.findByPreference(preference).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    public List<TourDTO> searchToursByTitle(String title) {
        return tourRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::mapTourToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TourDTO createTour(TourCreateDTO tourCreateDTO) {
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

        List<Place> places = new ArrayList<>();
        if (tourCreateDTO.getPlaceIds() != null && !tourCreateDTO.getPlaceIds().isEmpty()) {
            for (Long placeId : tourCreateDTO.getPlaceIds()) {
                Place place = placeRepository.findById(placeId)
                        .orElseThrow(() -> new PlaceNotFoundException(placeId));
                places.add(place);
            }
        } else {
            // Auto-generate tour places based on preferences
            places = generateRecommendedPlaces(preference);
        }

        tour.setPlaces(places);
        tour = tourRepository.save(tour);

        return mapTourToDTO(tour);
    }

    @Transactional
    public TourDTO updateTour(Long id, TourCreateDTO tourUpdateDTO) {
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
        return mapTourToDTO(tour);
    }

    @Transactional
    public void deleteTour(Long id) {
        if (!tourRepository.existsById(id)) {
            throw new TourNotFoundException(id);
        }
        tourRepository.deleteById(id);
    }

    @Transactional
    public TourDTO addPlaceToTour(Long tourId, Long placeId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new PlaceNotFoundException(placeId));

        tour.getPlaces().add(place);
        tour = tourRepository.save(tour);

        return mapTourToDTO(tour);
    }

    @Transactional
    public TourDTO removePlaceFromTour(Long tourId, Long placeId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new TourNotFoundException(tourId));

        tour.getPlaces().removeIf(place -> place.getId().equals(placeId));
        tour = tourRepository.save(tour);

        return mapTourToDTO(tour);
    }

    // Helper methods
    private Preference createNewPreference(PreferenceDTO preferenceDTO, User user) {
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

    private List<Place> generateRecommendedPlaces(Preference preference) {
        List<Place> recommendedPlaces = new ArrayList<>();

        // Get places based on attraction preferences
        if (preference.getAttractionTypePreferences() != null && !preference.getAttractionTypePreferences().isEmpty()) {
            for (AttractionType attractionType : preference.getAttractionTypePreferences()) {
                PlaceType placeType;

                // Map attraction types to place types
                switch (attractionType) {
                    case HISTORICAL:
                        placeType = PlaceType.HISTORICAL;
                        break;
                    case MUSEUMS:
                        placeType = PlaceType.MUSEUMS;
                        break;
                    case NATURE:
                        placeType = PlaceType.NATURE;
                        break;
                    case PARKS:
                        placeType = PlaceType.PARKS;
                        break;
                    case LANDMARKS:
                        placeType = PlaceType.LANDMARKS;
                        break;
                    default:
                        continue;
                }

                // Find places matching this type (limit to top 2 per type)
                List<Place> placesOfType = placeRepository.findByPlaceTypeOrderByAverageRatingDesc(placeType);
                if (!placesOfType.isEmpty()) {
                    recommendedPlaces.addAll(placesOfType.stream().limit(2).collect(Collectors.toList()));
                }
            }
        }

        // Add food places based on preferences
        if (preference.getFoodTypePreferences() != null && !preference.getFoodTypePreferences().isEmpty()) {
            List<Place> restaurants = placeRepository.findByPlaceType(PlaceType.RESTAURANT);
            if (!restaurants.isEmpty()) {
                recommendedPlaces.addAll(restaurants.stream().limit(2).collect(Collectors.toList()));
            }
        }

        // Add drink places based on preferences
        if (preference.getDrinkTypePreferences() != null && !preference.getDrinkTypePreferences().isEmpty()) {
            List<Place> cafeBars = placeRepository.findByPlaceType(PlaceType.CAFE_BAR);
            if (!cafeBars.isEmpty()) {
                recommendedPlaces.addAll(cafeBars.stream().limit(2).collect(Collectors.toList()));
            }
        }

        // Add shopping malls if preference is set
        if (Boolean.TRUE.equals(preference.getIncludeShoppingMalls())) {
            List<Place> malls = placeRepository.findByPlaceType(PlaceType.MALL);
            if (!malls.isEmpty()) {
                recommendedPlaces.addAll(malls.stream().limit(1).collect(Collectors.toList()));
            }
        }

        // Limit total places based on tour length
        int maxPlaces;
        switch (preference.getTourLength()) {
            case HALF_DAY:
                maxPlaces = 3;
                break;
            case FULL_DAY:
                maxPlaces = 5;
                break;
            case TWO_THREE_DAYS:
                maxPlaces = 8;
                break;
            case FOUR_SEVEN_DAYS:
                maxPlaces = 12;
                break;
            default:
                maxPlaces = 5;
        }

        if (recommendedPlaces.size() > maxPlaces) {
            recommendedPlaces = recommendedPlaces.subList(0, maxPlaces);
        }

        return recommendedPlaces;
    }

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
                    placeDTO.setAverageRating(place.getAverageRating());
                    placeDTO.setPhotoReference(place.getPhotoReference());
                    return placeDTO;
                })
                .collect(Collectors.toList());

        dto.setPlaces(placeDTOs);
        return dto;
    }
}
