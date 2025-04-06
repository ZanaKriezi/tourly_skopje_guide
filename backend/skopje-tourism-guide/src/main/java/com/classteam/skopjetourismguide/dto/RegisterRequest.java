package com.classteam.skopjetourismguide.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String name;
    private String surname;
    private Integer age;
    private String gender;
}