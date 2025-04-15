package com.classteam.skopjetourismguide.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleMapsService {

//    @Value("${google.maps.api.key}")
//    private String apiKey;
    private String apiKey = "AIzaSyCJIYdrnrRp1x3d-nQOLTVA5v940bTjUT4";

    private final RestTemplate restTemplate;

    public GoogleMapsService() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> getPlacesInSkopje(String type, int radius) {
        try {
            // Skopje center coordinates
            String location = "41.9981,21.4254";

            String url = String.format(
                    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=%d&type=%s&key=%s",
                    location,
                    radius,
                    URLEncoder.encode(type, StandardCharsets.UTF_8.toString()),
                    apiKey
            );

            return restTemplate.getForObject(URI.create(url), HashMap.class);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
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