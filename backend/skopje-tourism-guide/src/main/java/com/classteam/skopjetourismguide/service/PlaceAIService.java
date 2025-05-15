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
        logger.info("Found {} total places to consider for processing", places.size());
        int processed = 0;
        int considered = 0;

        for (Place place : places) {
            if (place.getName() == null || place.getName().isBlank()) {
                logger.debug("Skipping place with ID {} - missing name", place.getId());
                continue;
            }

            logger.debug("Evaluating place: {} (ID: {})", place.getName(), place.getId());
            boolean needsProcessing = false;

            // Check if description is needed
            boolean needsDescription = place.getDescription() == null || place.getDescription().isBlank();
            if (needsDescription) {
                logger.debug("Place {} needs description", place.getName());
                needsProcessing = true;
            }

            // Check if sentiment tag is needed
            boolean needsSentiment = place.getSentimentTag() == null && !isExcludedForSentimentAnalysis(place);
            if (needsSentiment) {
                logger.debug("Place {} needs sentiment tag", place.getName());
                needsProcessing = true;
            }

            if (needsProcessing) {
                considered++;
                try {
                    boolean updated = false;

                    // Generate description if missing
                    if (needsDescription) {
                        String description = generatePlaceDescription(place);
                        if (description != null && !description.isBlank()) {
                            place.setDescription(description);
                            updated = true;
                            logger.info("Generated description for place: {}", place.getName());
                        } else {
                            logger.warn("Failed to generate description for place: {}", place.getName());
                        }
                    }

                    // Generate sentiment tag if needed
                    if (needsSentiment) {
                        String sentimentTag = generateSentimentTag(place);
                        if (sentimentTag != null && !sentimentTag.isBlank()) {
                            place.setSentimentTag(sentimentTag);
                            updated = true;
                            logger.info("Generated sentiment tag for place: {}: {}", place.getName(), sentimentTag);
                        } else {
                            logger.warn("Failed to generate sentiment tag for place: {}", place.getName());
                        }
                    }

                    if (updated) {
                        Place savedPlace = placeRepository.save(place);
                        if (savedPlace != null) {
                            processed++;
                            logger.info("Successfully updated place in database: {}", place.getName());
                        } else {
                            logger.error("Failed to save place to database: {}", place.getName());
                        }
                    }
                } catch (Exception e) {
                    logger.error("Error processing place {}: {}", place.getName(), e.getMessage(), e);
                }
            } else {
                logger.debug("Place {} doesn't need processing", place.getName());
            }
        }

        logger.info("Completed processing places. Considered {} places. Updated {} places.", considered, processed);
    }

    /**
     * Process a single place for AI enhancements
     */
    @Transactional
    public Place processPlace(Long placeId) {
        logger.info("Processing place with ID: {}", placeId);

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found with ID: " + placeId));

        logger.info("Found place: {} (ID: {})", place.getName(), place.getId());
        logger.info("Current description: {}", place.getDescription());
        logger.info("Current sentiment tag: {}", place.getSentimentTag());

        boolean updated = false;

        // Generate description if missing
        if (place.getDescription() == null || place.getDescription().isBlank()) {
            logger.info("Generating description for place: {}", place.getName());
            String description = generatePlaceDescription(place);
            if (description != null && !description.isBlank()) {
                place.setDescription(description);
                updated = true;
                logger.info("Generated description: {}", description);
            } else {
                logger.warn("Failed to generate description");
            }
        }

        // Generate sentiment tag if needed
        if (!isExcludedForSentimentAnalysis(place) && place.getSentimentTag() == null) {
            logger.info("Generating sentiment tag for place: {}", place.getName());
            String sentimentTag = generateSentimentTag(place);
            if (sentimentTag != null && !sentimentTag.isBlank()) {
                place.setSentimentTag(sentimentTag);
                updated = true;
                logger.info("Generated sentiment tag: {}", sentimentTag);
            } else {
                logger.warn("Failed to generate sentiment tag");
            }
        } else {
            logger.info("Place {} is excluded from sentiment analysis or already has a sentiment tag", place.getName());
        }

        if (updated) {
            logger.info("Saving updated place: {}", place.getName());
            return placeRepository.save(place);
        } else {
            logger.info("No updates needed for place: {}", place.getName());
        }

        return place;
    }

    /**
     * Test method to diagnose AI service issues
     */
    @Transactional
    public void testAIService(Long placeId) {
        logger.info("Testing AI service with place ID: {}", placeId);

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found with ID: " + placeId));

        logger.info("Test place: {} ({})", place.getName(), place.getId());
        logger.info("Current description: {}", place.getDescription());
        logger.info("Current sentiment tag: {}", place.getSentimentTag());
        logger.info("Place type: {}", place.getPlaceType());
        logger.info("Average rating: {}", place.getAverageRating());
        logger.info("Has reviews: {}", place.getReviews() != null && !place.getReviews().isEmpty());

        // Test OpenAI connection with a simple prompt
        String testPrompt = "Say hello to Skopje!";
        try {
            String testResponse = getCompletionFromOpenAI(testPrompt);
            logger.info("OpenAI test response: {}", testResponse);
        } catch (Exception e) {
            logger.error("OpenAI test failed: {}", e.getMessage(), e);
        }

        // Test description generation
        try {
            String description = generatePlaceDescription(place);
            logger.info("Generated test description: {}", description);
        } catch (Exception e) {
            logger.error("Description generation test failed: {}", e.getMessage(), e);
        }

        // Test sentiment tag generation if applicable
        if (!isExcludedForSentimentAnalysis(place)) {
            try {
                String sentimentTag = generateSentimentTag(place);
                logger.info("Generated test sentiment tag: {}", sentimentTag);
            } catch (Exception e) {
                logger.error("Sentiment tag generation test failed: {}", e.getMessage(), e);
            }
        } else {
            logger.info("Place is excluded from sentiment analysis");
            if (excludedPlaceTypes.contains(place.getPlaceType())) {
                logger.info("Reason: Place type {} is in excluded types", place.getPlaceType());
            }
            if (place.getAverageRating() == null || place.getAverageRating() < 3.0f) {
                logger.info("Reason: Average rating {} is below threshold", place.getAverageRating());
            }
            if (place.getReviews() == null || place.getReviews().isEmpty()) {
                logger.info("Reason: No reviews available");
            }
        }
    }

    /**
     * Check if a place should be excluded from sentiment analysis
     */
    private boolean isExcludedForSentimentAnalysis(Place place) {
        // Check if place type is excluded
        if (excludedPlaceTypes.contains(place.getPlaceType())) {
            logger.debug("Place {} is excluded due to type: {}", place.getName(), place.getPlaceType());
            return true;
        }

        // Check for low ratings or no ratings
        if (place.getAverageRating() == null || place.getAverageRating() < 3.0f) {
            logger.debug("Place {} is excluded due to low rating: {}", place.getName(), place.getAverageRating());
            return true;
        }

        // Check if there are no reviews
        if (place.getReviews() == null || place.getReviews().isEmpty()) {
            logger.debug("Place {} is excluded due to no reviews", place.getName());
            return true;
        }

        return false;
    }

    /**
     * Generate a sentiment tag for a place based on its reviews
     */
    private String generateSentimentTag(Place place) {
        if (place.getReviews() == null || place.getReviews().isEmpty()) {
            logger.debug("No reviews available for sentiment analysis of place: {}", place.getName());
            return null;
        }

        // Collect review texts
        List<String> reviewTexts = place.getReviews().stream()
                .filter(review -> review.getComment() != null && !review.getComment().isBlank())
                .map(Review::getComment)
                .collect(Collectors.toList());

        if (reviewTexts.isEmpty()) {
            logger.debug("No review texts available for sentiment analysis of place: {}", place.getName());
            return null;
        }

        logger.debug("Found {} reviews with text for place: {}", reviewTexts.size(), place.getName());

        // Prepare the prompt for OpenAI
        String prompt = String.format(
                "Based on the following reviews for \"%s\" in Skopje, North Macedonia, assign ONE sentiment tag from this list, or generate a more appropriate one: " +
                        "UNIQUE, AUTHENTIC, TRENDY, POPULAR, PEACEFUL, FAMILY_FRIENDLY, ROMANTIC, HISTORICAL. " +
                        "Choose the tag that best represents the overall sentiment. " +
                        "Reply with ONLY the sentiment tag, nothing else.\n\nReviews:\n%s",
                place.getName(),
                String.join("\n\n", reviewTexts.subList(0, Math.min(reviewTexts.size(), 5)))  // Limit to 5 reviews
        );

        try {
            logger.debug("Sending prompt to OpenAI for sentiment analysis of place: {}", place.getName());
            String response = getCompletionFromOpenAI(prompt);
            logger.debug("Received response from OpenAI: {}", response);

            // Clean up the response
            if (response != null && !response.isBlank()) {
                response = response.trim().toUpperCase();

                // Validate against enum values (assuming sentimentTag will be stored as a string)
                Set<String> validTags = Arrays.stream(com.classteam.skopjetourismguide.model.enumerations.SentimentTag.values())
                        .map(Enum::name)
                        .collect(Collectors.toSet());

                if (validTags.contains(response)) {
                    logger.debug("Valid sentiment tag generated for place {}: {}", place.getName(), response);
                    return response;
                } else {
                    logger.warn("AI returned invalid sentiment tag: {} for place: {}", response, place.getName());
                }
            }
        } catch (Exception e) {
            logger.error("Error generating sentiment tag for {}: {}", place.getName(), e.getMessage(), e);
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

        logger.debug("Sending prompt to OpenAI for description generation for place: {}", place.getName());

        try {
            String response = getCompletionFromOpenAI(prompt);
            logger.debug("Received description from OpenAI: {}", response);
            return response;
        } catch (Exception e) {
            logger.error("Error generating description for {}: {}", place.getName(), e.getMessage(), e);
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

        try {
            logger.debug("Sending request to OpenAI API");
            ChatCompletions completions = openAIClient.getChatCompletions(deploymentName, options);
            logger.debug("Received response from OpenAI API");

            if (completions != null && !completions.getChoices().isEmpty()) {
                String content = completions.getChoices().get(0).getMessage().getContent();
                logger.debug("OpenAI content response: {}", content);
                return content;
            } else {
                logger.warn("Empty or null response from OpenAI");
                return null;
            }
        } catch (Exception e) {
            logger.error("Error communicating with OpenAI: {}", e.getMessage(), e);
            throw e; // Re-throw to allow caller to handle or log the specific error
        }
    }
}