package com.classteam.skopjetourismguide.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PreferenceNotFoundException extends RuntimeException {
    public PreferenceNotFoundException(Long id) {
        super("Preference not found with id: " + id);
    }
}