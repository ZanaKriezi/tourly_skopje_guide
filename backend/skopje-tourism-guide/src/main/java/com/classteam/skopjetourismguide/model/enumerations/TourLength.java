package com.classteam.skopjetourismguide.model.enumerations;

public enum TourLength {
    HALF_DAY,
    FULL_DAY,
    TWO_THREE_DAYS("2_3_DAYS"),
    FOUR_SEVEN_DAYS("4_7_DAYS");

    private final String value;

    TourLength() {
        this.value = name();
    }

    TourLength(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}