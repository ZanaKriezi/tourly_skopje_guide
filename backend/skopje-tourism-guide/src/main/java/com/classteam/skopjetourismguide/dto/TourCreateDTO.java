package com.classteam.skopjetourismguide.dto;

import lombok.Data;

import java.util.List;

@Data
public class TourCreateDTO {
    private String title;
    private Long userId;
    private Long preferenceId;
    private PreferenceDTO preferenceDTO;
    private List<Long> placeIds;
}
