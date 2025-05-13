package com.classteam.skopjetourismguide.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class TourDTO {
    private Long id;
    private String title;
    private LocalDateTime dateCreated;
    private Long userId;
    private String userName;
    private Long preferenceId;
    private String preferenceDescription;
    private List<PlaceDTO> places = new ArrayList<>();
}
