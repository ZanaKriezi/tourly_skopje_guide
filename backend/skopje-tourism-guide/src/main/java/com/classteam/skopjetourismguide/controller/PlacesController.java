package com.classteam.skopjetourismguide.controller;

import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.service.PlacesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlacesController {

    private final PlacesService placesService;

    @Autowired
    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        List<Place> places = placesService.getAllPlaces();
        return ResponseEntity.ok(places);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Long id) {
        return placesService.getPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{placeType}")
    public ResponseEntity<List<Place>> getPlacesByType(@PathVariable String placeType) {
        try {
            PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
            List<Place> places = placesService.getPlacesByType(type);
            return ResponseEntity.ok(places);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/top-rated/{placeType}")
    public ResponseEntity<List<Place>> getTopRatedPlacesByType(@PathVariable String placeType) {
        try {
            PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
            List<Place> places = placesService.getTopRatedPlacesByType(type);
            return ResponseEntity.ok(places);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/rating/{minRating}")
    public ResponseEntity<List<Place>> getPlacesByMinimumRating(@PathVariable Float minRating) {
        List<Place> places = placesService.getPlacesByMinimumRating(minRating);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Place>> searchPlaces(
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

    @GetMapping("/fetch-from-google")
    public ResponseEntity<List<Place>> fetchPlacesFromGoogle(
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
}