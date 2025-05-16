package com.classteam.skopjetourismguide.controller;

import com.classteam.skopjetourismguide.dto.PageResponseDTO;
import com.classteam.skopjetourismguide.dto.PlaceDTO;
import com.classteam.skopjetourismguide.dto.PlaceDetailDTO;
import com.classteam.skopjetourismguide.dto.ReviewDTO;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.service.PlacesService;
import com.classteam.skopjetourismguide.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlacesController {

    private final PlacesService placesService;
    private final ReviewService reviewService;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int DEFAULT_REVIEW_PREVIEW_SIZE = 3;

    @Autowired
    public PlacesController(PlacesService placesService, ReviewService reviewService) {
        this.placesService = placesService;
        this.reviewService = reviewService;
    }

    // ORIGINAL ENDPOINTS (For backward compatibility)

    @GetMapping("/legacy")
    public ResponseEntity<List<Place>> getAllPlacesLegacy() {
        List<Place> places = placesService.getAllPlaces();
        return ResponseEntity.ok(places);
    }

    @GetMapping("/legacy/{id}")
    public ResponseEntity<Place> getPlaceByIdLegacy(@PathVariable Long id) {
        return placesService.getPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/legacy/type/{placeType}")
    public ResponseEntity<List<Place>> getPlacesByTypeLegacy(@PathVariable String placeType) {
        try {
            PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
            List<Place> places = placesService.getPlacesByType(type);
            return ResponseEntity.ok(places);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/legacy/top-rated/{placeType}")
    public ResponseEntity<List<Place>> getTopRatedPlacesByTypeLegacy(@PathVariable String placeType) {
        try {
            PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
            List<Place> places = placesService.getTopRatedPlacesByType(type);
            return ResponseEntity.ok(places);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/legacy/rating/{minRating}")
    public ResponseEntity<List<Place>> getPlacesByMinimumRatingLegacy(@PathVariable Float minRating) {
        List<Place> places = placesService.getPlacesByMinimumRating(minRating);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/legacy/search")
    public ResponseEntity<List<Place>> searchPlacesLegacy(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String sentimentTag) {

        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(placesService.searchPlacesByName(name));
        } else if (address != null && !address.isEmpty()) {
            return ResponseEntity.ok(placesService.searchPlacesByAddress(address));
        } else if (description != null && !description.isEmpty()) {
            return ResponseEntity.ok(placesService.searchPlacesByDescription(description));
        } else if (sentimentTag != null && !sentimentTag.isEmpty()) {
            return ResponseEntity.ok(placesService.searchPlacesBySentimentTag(sentimentTag));
        } else {
            return ResponseEntity.ok(placesService.getAllPlaces());
        }
    }

    @GetMapping("/legacy/fetch-from-google")
    public ResponseEntity<List<Place>> fetchPlacesFromGoogleLegacy(
            @RequestParam(defaultValue = "tourist_attraction") String type,
            @RequestParam(defaultValue = "5000") int radius) {
        List<Place> places = placesService.fetchAndSavePlacesFromGoogle(type, radius);
        return ResponseEntity.ok(places);
    }

    @PostMapping
    public ResponseEntity<Place> createPlace(@RequestBody Place place) {
        Place newPlace = placesService.createPlace(place);
        return ResponseEntity.status(HttpStatus.CREATED).body(newPlace);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable Long id, @RequestBody Place placeDetails) {
        return placesService.updatePlace(id, placeDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        boolean deleted = placesService.deletePlace(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // NEW OPTIMIZED ENDPOINTS WITH PAGINATION AND DTOS - UPDATED WITH RATING SORTING

    @GetMapping
    public ResponseEntity<PageResponseDTO<PlaceDTO>> getAllPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        PageResponseDTO<PlaceDTO> response = placesService.getAllPlacesPaginated(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailDTO> getPlaceById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "3") int previewReviews) {

        return placesService.getPlaceWithLimitedReviews(id, previewReviews)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{placeType}")
    public ResponseEntity<PageResponseDTO<PlaceDTO>> getPlacesByType(
            @PathVariable String placeType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            PageResponseDTO<PlaceDTO> response = placesService.getPlacesByTypePaginated(type, pageable);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<PlaceDTO>> searchPlaces(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(placesService.searchPlacesByNamePaginated(name, pageable));
        } else {
            return ResponseEntity.ok(placesService.getAllPlacesPaginated(pageable));
        }
    }

    // Add the dedicated reviews endpoint
    @GetMapping("/{placeId}/reviews")
    public ResponseEntity<PageResponseDTO<ReviewDTO>> getPlaceReviews(
            @PathVariable Long placeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(reviewService.getReviewsByPlaceId(placeId, pageable));
    }
}