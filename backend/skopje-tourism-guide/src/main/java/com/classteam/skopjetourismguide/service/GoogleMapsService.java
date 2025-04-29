package com.classteam.skopjetourismguide.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GoogleMapsService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    // Multiple center points around Skopje to improve coverage
    private final String[] skopjeLocations = {
            "41.9981,21.4254", // City center
            "42.0040,21.3923", // West Skopje
            "41.9937,21.4533", // East Skopje
            "42.0173,21.4406", // North Skopje
            "41.9800,21.4194", // South Skopje
            "42.0227,21.4390", // North extreme
            "41.9710,21.4170", // South extreme
            "41.9935,21.3771", // West extreme
            "41.9990,21.4750"  // East extreme
    };

    public GoogleMapsService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> getPlacesInSkopje(String type, int radius) {
        try {
            String location = "41.9981,21.4254"; // Central Skopje coordinates
            Map<String, Object> combinedResults = new HashMap<>();
            List<Map<String, Object>> allResults = new ArrayList<>();
            combinedResults.put("results", allResults);

            // Improve the search by adding keyword if appropriate
            String keyword = getKeywordForType(type);
            String additionalParams = keyword != null ? "&keyword=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8.toString()) : "";

            // Initial request
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=%d&type=%s%s&key=%s",
                    location, radius,
                    URLEncoder.encode(type, StandardCharsets.UTF_8.toString()),
                    additionalParams,
                    apiKey
            );

            Map<String, Object> response = restTemplate.getForObject(URI.create(url), HashMap.class);
            System.out.println("🔍 GOOGLE RESPONSE for " + type + ": Status=" + response.get("status"));

            // Add first page results
            if (response.containsKey("results")) {
                List<Map<String, Object>> firstPageResults = (List<Map<String, Object>>) response.get("results");
                allResults.addAll(firstPageResults);
                System.out.println("Found " + firstPageResults.size() + " places in first page");
            }

            // Handle pagination with next_page_token if present
            int pageCounter = 0;
            while (response.containsKey("next_page_token") && response.get("next_page_token") != null && pageCounter < 10) {
                pageCounter++;
                // Need to wait before using next_page_token (Google's requirement)
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

                String nextPageToken = (String) response.get("next_page_token");
                String nextUrl = String.format(
                        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=%s&key=%s",
                        nextPageToken, apiKey
                );

                response = restTemplate.getForObject(URI.create(nextUrl), HashMap.class);

                if (response.containsKey("results")) {
                    List<Map<String, Object>> nextPageResults = (List<Map<String, Object>>) response.get("results");
                    allResults.addAll(nextPageResults);
                    System.out.println("Found " + nextPageResults.size() + " additional places in page " + pageCounter);
                }
            }

            System.out.println("Total places found for " + type + ": " + allResults.size());

            return combinedResults;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("results", new ArrayList<>());
            return errorResponse;
        }
    }

    /**
     * Get detailed information about a specific place using its place_id
     *
     * @param placeId The Google place_id to get details for
     * @return A map containing place details including reviews
     */
    public Map<String, Object> getPlaceDetails(String placeId) {
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=name,rating,reviews,formatted_phone_number,website,address_components,opening_hours&key=%s",
                    placeId,
                    apiKey
            );

            Map<String, Object> response = restTemplate.getForObject(URI.create(url), HashMap.class);

            if (response.containsKey("status") && "OK".equals(response.get("status"))) {
                return response;
            } else {
                System.out.println("Error getting place details for " + placeId + ": " + response.get("status"));
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", response.get("status"));
                return errorResponse;
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    // Additional method to search from multiple center points for better coverage
    public Map<String, Object> getPlacesInSkopjeMultiPoint(String type, int radius) {
        return getPlacesInSkopjeMultiPoint(type, radius, null);
    }

    /**
     * Gets places of a specific type from multiple points around Skopje with optional keyword
     *
     * @param type Google place type
     * @param radius Search radius in meters
     * @param keyword Optional keyword to refine search
     * @return Map containing search results
     */
    public Map<String, Object> getPlacesInSkopjeMultiPoint(String type, int radius, String keyword) {
        try {
            Map<String, Object> combinedResults = new HashMap<>();
            List<Map<String, Object>> allResults = new ArrayList<>();
            combinedResults.put("results", allResults);

            // Track place IDs to avoid duplicates
            Map<String, Boolean> processedPlaceIds = new HashMap<>();

            // Prepare keyword parameter if provided
            String keywordParam = "";
            if (keyword != null && !keyword.isEmpty()) {
                keywordParam = "&keyword=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8.toString());
            }

            for (String location : skopjeLocations) {
                String url = String.format(
                        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=%d&type=%s%s&key=%s",
                        location, radius,
                        URLEncoder.encode(type, StandardCharsets.UTF_8.toString()),
                        keywordParam,
                        apiKey
                );

                Map<String, Object> response = restTemplate.getForObject(URI.create(url), HashMap.class);
                processResults(response, allResults, processedPlaceIds);

                // Handle pagination - we limit to 2 pages per location to avoid hitting API quotas
                int pageCounter = 0;
                while (response.containsKey("next_page_token") && response.get("next_page_token") != null && pageCounter < 2) {
                    pageCounter++;
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    String nextPageToken = (String) response.get("next_page_token");
                    String nextUrl = String.format(
                            "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=%s&key=%s",
                            nextPageToken, apiKey
                    );

                    response = restTemplate.getForObject(URI.create(nextUrl), HashMap.class);
                    processResults(response, allResults, processedPlaceIds);
                }

                // Wait between location queries to avoid rate limiting
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            System.out.println("Total unique places found for " + type + (keyword != null ? " with keyword " + keyword : "") + ": " + allResults.size());

            return combinedResults;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("results", new ArrayList<>());
            return errorResponse;
        }
    }

    // Helper method to add keywords for certain place types to improve results
    private String getKeywordForType(String type) {
        return switch (type) {
            case "tourist_attraction" -> "historic";
            case "landmark" -> "monument";
            case "point_of_interest" -> "attraction";
            case "restaurant" -> "food";
            default -> null;
        };
    }

    private void processResults(Map<String, Object> response, List<Map<String, Object>> allResults,
                                Map<String, Boolean> processedPlaceIds) {
        if (response.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            int newPlaces = 0;

            for (Map<String, Object> place : results) {
                String placeId = (String) place.get("place_id");
                if (placeId != null && !processedPlaceIds.containsKey(placeId)) {
                    allResults.add(place);
                    processedPlaceIds.put(placeId, true);
                    newPlaces++;
                }
            }

            System.out.println("Found " + results.size() + " places, " + newPlaces + " were new");
        }
    }

    public Map<String, Object> getGeocodingForSkopje() {
        try {
            String address = "Skopje, North Macedonia";

            String url = String.format(
                    "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                    URLEncoder.encode(address, StandardCharsets.UTF_8.toString()),
                    apiKey
            );

            return restTemplate.getForObject(URI.create(url), HashMap.class);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> getDirectionsInSkopje(String origin, String destination) {
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/directions/json?origin=%s&destination=%s&key=%s",
                    URLEncoder.encode(origin + ", Skopje", StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(destination + ", Skopje", StandardCharsets.UTF_8.toString()),
                    apiKey
            );

            return restTemplate.getForObject(URI.create(url), HashMap.class);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }
}