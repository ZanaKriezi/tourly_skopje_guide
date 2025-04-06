package com.classteam.skopjetourismguide.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder

public class MessageResponse {
    private String message;
    public MessageResponse() {
    }

    // Adding an explicit constructor as a backup
    public MessageResponse(String message) {
        this.message = message;
    }
}