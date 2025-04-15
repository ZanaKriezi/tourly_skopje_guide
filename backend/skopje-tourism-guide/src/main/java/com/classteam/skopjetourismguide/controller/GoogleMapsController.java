package com.classteam.skopjetourismguide.controller;

import com.classteam.skopjetourismguide.service.GoogleMapsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@CrossOrigin(origins = "*")
public class GoogleMapsController {

    private final GoogleMapsService googleMapsService;

    @Autowired
    public GoogleMapsController(GoogleMapsService googleMapsService) {
        this.googleMapsService = googleMapsService;
    }

    @GetMapping("/places")
    public ResponseEntity<Map<String, Object>> getPlacesInSkopje(
            @RequestParam(defaultValue = "restaurant") String type,
            @RequestParam(defaultValue = "1000") int radius) {
        Map<String, Object> result = googleMapsService.getPlacesInSkopje(type, radius);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Object>> getGeocodingForSkopje() {
        Map<String, Object> result = googleMapsService.getGeocodingForSkopje();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/directions")
    public ResponseEntity<Map<String, Object>> getDirectionsInSkopje(
            @RequestParam String origin,
            @RequestParam String destination) {
        Map<String, Object> result = googleMapsService.getDirectionsInSkopje(origin, destination);
        return ResponseEntity.ok(result);
    }
}