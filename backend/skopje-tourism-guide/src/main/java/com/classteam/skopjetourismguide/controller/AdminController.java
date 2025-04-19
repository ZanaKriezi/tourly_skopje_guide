package com.classteam.skopjetourismguide.web.rest;

import com.classteam.skopjetourismguide.service.PlaceSchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PlaceSchedulingService placeSchedulingService;

    @Autowired
    public AdminController(PlaceSchedulingService placeSchedulingService) {
        this.placeSchedulingService = placeSchedulingService;
    }

    @PostMapping("/update-places")
    public ResponseEntity<String> triggerPlaceUpdate() {
        new Thread( placeSchedulingService::manualFetchAndUpdatePlacesData ).start();

        return ResponseEntity.ok("Place update process started in background");
    }
}