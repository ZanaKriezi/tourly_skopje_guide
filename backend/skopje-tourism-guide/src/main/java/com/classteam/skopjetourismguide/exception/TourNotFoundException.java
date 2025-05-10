package com.classteam.skopjetourismguide.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TourNotFoundException extends RuntimeException {
    public TourNotFoundException(Long id) {
        super("Tour not found with id: " + id);
    }
}