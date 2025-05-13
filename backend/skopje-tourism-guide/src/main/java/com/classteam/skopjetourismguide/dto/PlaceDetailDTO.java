// PlaceDetailDTO.java
package com.classteam.skopjetourismguide.dto;

import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import lombok.Data;
import java.util.List;

@Data
public class PlaceDetailDTO {
    private Long id;
    private String name;
    private String description;
    private PlaceType placeType;
    private Double latitude;
    private Double longitude;
    private String address;
    private String phoneNumber;
    private String websiteURL;
    private String socialMedia;
    private Float averageRating;
    private String photoReference;
    private String sentimentTag;
    private Integer reviewCount;
    private List<ReviewDTO> recentReviews; // Limited preview of reviews
}