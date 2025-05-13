package com.classteam.skopjetourismguide.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlaceNotFoundException extends RuntimeException {
    public PlaceNotFoundException(Long id) {
        super("Place not found with id: " + id);
    }
}