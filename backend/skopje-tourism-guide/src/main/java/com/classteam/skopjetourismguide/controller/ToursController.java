
package com.classteam.skopjetourismguide.controller;

import com.classteam.skopjetourismguide.service.ToursService;
import com.classteam.skopjetourismguide.dto.TourDTO;
import com.classteam.skopjetourismguide.dto.TourCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class ToursController {

    private final ToursService tourService;

    @Autowired
    public ToursController(ToursService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<List<TourDTO>> getAllTours() {
        List<TourDTO> tours = tourService.getAllTours();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getTourById(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TourDTO>> getToursByUser(@PathVariable Long userId) {
        List<TourDTO> tours = tourService.getToursByUser(userId);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/preference/{preferenceId}")
    public ResponseEntity<List<TourDTO>> getToursByPreference(@PathVariable Long preferenceId) {
        List<TourDTO> tours = tourService.getToursByPreference(preferenceId);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TourDTO>> searchToursByTitle(@RequestParam("title") String title) {
        List<TourDTO> tours = tourService.searchToursByTitle(title);
        return ResponseEntity.ok(tours);
    }

    @PostMapping
    public ResponseEntity<TourDTO> createTour(@RequestBody TourCreateDTO tourCreateDTO) {
        TourDTO createdTour = tourService.createTour(tourCreateDTO);
        return new ResponseEntity<>(createdTour, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourDTO> updateTour(@PathVariable Long id, @RequestBody TourCreateDTO tourUpdateDTO) {
        TourDTO updatedTour = tourService.updateTour(id, tourUpdateDTO);
        return ResponseEntity.ok(updatedTour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{tourId}/places/{placeId}")
    public ResponseEntity<TourDTO> addPlaceToTour(@PathVariable Long tourId, @PathVariable Long placeId) {
        TourDTO updatedTour = tourService.addPlaceToTour(tourId, placeId);
        return ResponseEntity.ok(updatedTour);
    }

    @DeleteMapping("/{tourId}/places/{placeId}")
    public ResponseEntity<TourDTO> removePlaceFromTour(@PathVariable Long tourId, @PathVariable Long placeId) {
        TourDTO updatedTour = tourService.removePlaceFromTour(tourId, placeId);
        return ResponseEntity.ok(updatedTour);
    }
}