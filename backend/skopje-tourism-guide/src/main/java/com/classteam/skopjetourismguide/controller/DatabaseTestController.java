package com.classteam.skopjetourismguide.controller;

import com.classteam.skopjetourismguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class DatabaseTestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/db-connection")
    public ResponseEntity<String> testDbConnection() {
        try {
            // Just count users to test the connection
            long userCount = userRepository.count();
            return ResponseEntity.ok("Database connection successful! User count: " + userCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Database connection failed: " + e.getMessage());
        }
    }
}