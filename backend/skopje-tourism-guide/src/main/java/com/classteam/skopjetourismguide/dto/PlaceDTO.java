// PlaceDTO.java
package com.classteam.skopjetourismguide.dto;

import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import lombok.Data;

@Data
public class PlaceDTO {
    private Long id;
    private String name;
    private String description;
    private PlaceType placeType;
    private Double latitude;
    private Double longitude;
    private String address;
    private Float averageRating;
    private String photoReference;
    private Integer reviewCount; // Just the count, not the reviews themselves
}