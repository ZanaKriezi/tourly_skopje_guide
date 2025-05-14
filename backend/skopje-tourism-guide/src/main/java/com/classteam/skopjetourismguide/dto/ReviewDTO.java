// ReviewDTO.java
package com.classteam.skopjetourismguide.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime timestamp;
    private Long userId;
    private String userName; // Just the name, not the full user object
}