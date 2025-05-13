package com.classteam.skopjetourismguide.dto;

import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import lombok.Data;

@Data
public class PlaceDTO {
    private Long id;
    private String name;
    private PlaceType placeType;
    private String description;
    private Double latitude;
    private Double longitude;
    private Float averageRating;
    private String sentimentTag;
    private String photoReference;
}
