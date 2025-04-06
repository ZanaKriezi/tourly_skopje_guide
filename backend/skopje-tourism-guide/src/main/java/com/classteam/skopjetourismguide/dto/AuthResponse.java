package com.classteam.skopjetourismguide.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
    private String name;
    private String surname;

    public static AuthResponse of(String token, Long id, String username, String email, String role, String name, String surname) {
        return AuthResponse.builder()
                .token(token)
                .id(id)
                .username(username)
                .email(email)
                .role(role)
                .name(name)
                .surname(surname)
                .build();
    }
}