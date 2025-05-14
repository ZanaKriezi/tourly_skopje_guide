package com.classteam.skopjetourismguide.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaceAIService {

    private static final Logger logger = LoggerFactory.getLogger(PlaceAIService.class);

    private final PlaceRepository placeRepository;
    private final OpenAIClient openAIClient;
    private final String deploymentName;

    // List of place types to exclude from sentiment analysis
    private final Set<PlaceType> excludedPlaceTypes = Set.of(
            PlaceType.SCHOOL, PlaceType.UNIVERSITY, PlaceType.LIBRARY, PlaceType.RESEARCH_INSTITUTE,
            PlaceType.CHURCH, PlaceType.MOSQUE, PlaceType.TEMPLE, PlaceType.SYNAGOGUE, PlaceType.PLACE_OF_WORSHIP,
            PlaceType.GOVERNMENT_BUILDING, PlaceType.EMBASSY, PlaceType.POLICE, PlaceType.POST_OFFICE,
            PlaceType.BANK, PlaceType.HOSPITAL, PlaceType.PHARMACY, PlaceType.AQUARIUM, PlaceType.BEAUTY_SALON,
            PlaceType.CEMETERY, PlaceType.COURTHOUSE, PlaceType.PET_STORE, PlaceType.TOURIST_INFORMATION,
            PlaceType.UNKNOWN
    );

    public PlaceAIService(
            PlaceRepository placeRepository,
            OpenAIClient openAIClient,
            @Value("${azure.openai.deployment}") String deploymentName) {
        this.placeRepository = placeRepository;
        this.openAIClient = openAIClient;
        this.deploymentName = deploymentName;
    }

    /**
     * Process all places that need AI enhancements (description and sentiment tag)
     */
    @Transactional
    public void processAllPlaces() {
        logger.info("Starting to process all places for AI enhancements");

        List<Place> places = placeRepository.findAll();
        int processed = 0;

        for (Place place : places) {
            if (shouldProcessPlace(place)) {
                try {
                    boolean updated = false;

                    // Generate description if missing
                    if (place.getDescription() == null || place.getDescription().isBlank()) {
                        String description = generatePlaceDescription(place);
                        if (description != null && !description.isBlank()) {
                            place.setDescription(description);
                            updated = true;
                        }
                    }

                    // Generate sentiment tag if needed
                    if (!isExcludedForSentimentAnalysis(place) && place.getSentimentTag() == null) {
                        String sentimentTag = generateSentimentTag(place);
                        if (sentimentTag != null && !sentimentTag.isBlank()) {
                            place.setSentimentTag(sentimentTag);
                            updated = true;
                        }
                    }

                    if (updated) {
                        placeRepository.save(place);
                        processed++;
                        logger.info("Updated place: {}", place.getName());
                    }
                } catch (Exception e) {
                    logger.error("Error processing place {}: {}", place.getName(), e.getMessage());
                }
            }
        }

        logger.info("Completed processing places. Updated {} places.", processed);
    }

    /**
     * Process a single place for AI enhancements
     */
    @Transactional
    public Place processPlace(Long placeId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found with ID: " + placeId));

        if (shouldProcessPlace(place)) {
            // Generate description if missing
            if (place.getDescription() == null || place.getDescription().isBlank()) {
                String description = generatePlaceDescription(place);
                if (description != null && !description.isBlank()) {
                    place.setDescription(description);
                }
            }

            // Generate sentiment tag if needed
            if (!isExcludedForSentimentAnalysis(place) && place.getSentimentTag() == null) {
                String sentimentTag = generateSentimentTag(place);
                if (sentimentTag != null && !sentimentTag.isBlank()) {
                    place.setSentimentTag(sentimentTag);
                }
            }

            return placeRepository.save(place);
        }

        return place;
    }

    /**
     * Determine if a place should be processed for AI enhancements
     */
    private boolean shouldProcessPlace(Place place) {
        // Don't process place if it's missing essential information
        if (place.getName() == null || place.getName().isBlank()) {
            return false;
        }

        // Always generate description for any place
        if (place.getDescription() == null || place.getDescription().isBlank()) {
            return true;
        }

        // For sentiment tag, check if it qualifies
        if (place.getSentimentTag() == null) {
            return !isExcludedForSentimentAnalysis(place);
        }

        return false;
    }

    /**
     * Check if a place should be excluded from sentiment analysis
     */
    private boolean isExcludedForSentimentAnalysis(Place place) {
        // Check if place type is excluded
        if (excludedPlaceTypes.contains(place.getPlaceType())) {
            return true;
        }

        // Check for low ratings or no ratings
        if (place.getAverageRating() == null || place.getAverageRating() < 3.0f) {
            return true;
        }

        // Check if there are no reviews
        if (place.getReviews() == null || place.getReviews().isEmpty()) {
            return true;
        }

        return false;
    }

    /**
     * Generate a sentiment tag for a place based on its reviews
     */
    private String generateSentimentTag(Place place) {
        if (place.getReviews() == null || place.getReviews().isEmpty()) {
            return null;
        }

        // Collect review texts
        List<String> reviewTexts = place.getReviews().stream()
                .filter(review -> review.getComment() != null && !review.getComment().isBlank())
                .map(Review::getComment)
                .collect(Collectors.toList());

        if (reviewTexts.isEmpty()) {
            return null;
        }

        // Prepare the prompt for OpenAI
        String prompt = String.format(
                "Based on the following reviews for \"%s\" in Skopje, North Macedonia, assign ONE sentiment tag from this list: " +
                        "UNIQUE, AUTHENTIC, TRENDY, POPULAR, PEACEFUL, FAMILY_FRIENDLY, ROMANTIC, HISTORICAL. " +
                        "Choose the tag that best represents the overall sentiment. " +
                        "Reply with ONLY the sentiment tag, nothing else.\n\nReviews:\n%s",
                place.getName(),
                String.join("\n\n", reviewTexts.subList(0, Math.min(reviewTexts.size(), 5)))  // Limit to 5 reviews
        );

        try {
            String response = getCompletionFromOpenAI(prompt);

            // Clean up the response
            if (response != null && !response.isBlank()) {
                response = response.trim().toUpperCase();

                // Validate against enum values (assuming sentimentTag will be stored as a string)
                Set<String> validTags = Arrays.stream(com.classteam.skopjetourismguide.model.enumerations.SentimentTag.values())
                        .map(Enum::name)
                        .collect(Collectors.toSet());

                if (validTags.contains(response)) {
                    return response;
                } else {
                    logger.warn("AI returned invalid sentiment tag: {} for place: {}", response, place.getName());
                }
            }
        } catch (Exception e) {
            logger.error("Error generating sentiment tag for {}: {}", place.getName(), e.getMessage());
        }

        return null;
    }

    /**
     * Generate a description for a place
     */
    private String generatePlaceDescription(Place place) {
        // Prepare the prompt for OpenAI
        String prompt = String.format(
                "Create a compelling and informative description for \"%s\" located in Skopje, North Macedonia. " +
                        "Type: %s. " +
                        "Average Rating: %s/5. " +
                        "The description should be 2-3 sentences long, highlighting what makes this place special " +
                        "and be useful for tourists visiting Skopje. " +
                        "If this is a well-known place, mention why it's famous.",
                place.getName(),
                place.getPlaceType(),
                place.getAverageRating() != null ? place.getAverageRating() : "N/A"
        );

        System.out.printf ( "Generating description for PLACE: %s%n", place.getName ());

        try {
            return getCompletionFromOpenAI(prompt);
        } catch (Exception e) {
            logger.error("Error generating description for {}: {}", place.getName(), e.getMessage());
            return null;
        }
    }

    /**
     * Get a completion from OpenAI
     */
    private String getCompletionFromOpenAI(String prompt) {
        List<ChatRequestMessage> messages = new ArrayList<>();
        messages.add(new ChatRequestSystemMessage("You are a helpful travel guide assistant for Skopje, North Macedonia."));
        messages.add(new ChatRequestUserMessage(prompt));

        ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
        options.setMaxTokens(500);
        options.setTemperature(0.7);

        ChatCompletions completions = openAIClient.getChatCompletions(deploymentName, options);

        if (!completions.getChoices().isEmpty()) {
            return completions.getChoices().get(0).getMessage().getContent();
        }

        return null;
    }
}