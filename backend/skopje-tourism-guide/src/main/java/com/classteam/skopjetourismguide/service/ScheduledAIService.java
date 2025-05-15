package com.classteam.skopjetourismguide.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledAIService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledAIService.class);

    private final PlaceAIService placeAIService;

    public ScheduledAIService(PlaceAIService placeAIService) {
        this.placeAIService = placeAIService;
    }

    /**
     * Update place descriptions and sentiment tags weekly
     * Runs every 7 days
     */
    @Scheduled(fixedRate = 7 * 24 * 60 * 60 * 1000) // Every 7 days in milliseconds
    public void updatePlaceEnhancements() {
        logger.info("Starting scheduled update of place descriptions and sentiment tags");
        try {
            placeAIService.processAllPlaces();
            logger.info("Completed scheduled update of place descriptions and sentiment tags");
        } catch (Exception e) {
            logger.error("Error during scheduled update of places: {}", e.getMessage(), e);
        }
    }

    /**
     * Debug method to test the AI service with a specific place
     * Can be called manually from a controller for testing
     */
    public void testAIServiceWithPlace(Long placeId) {
        logger.info("Testing AI service with place ID: {}", placeId);
        try {
            placeAIService.testAIService(placeId);
            logger.info("Test completed for place ID: {}", placeId);
        } catch (Exception e) {
            logger.error("Error testing AI service with place {}: {}", placeId, e.getMessage(), e);
        }
    }
}