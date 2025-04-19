package com.classteam.skopjetourismguide.model;

import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "places")
@Data
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private PlaceType placeType;

    //Google's placeId for unique identification
    @Column(unique = true, nullable = false)
    private String googlePlaceId;

    private Double latitude;

    private Double longitude;

    private String vicinity;  // Short formatted address returned by Google

    private String photoReference;  // For Google Photos API

    private Boolean openNow;

    private Integer userRatingsTotal;

    private String address;
    private String phoneNumber;
    private String websiteURL;
    private String socialMedia;
    private Float averageRating;
    private String sentimentTag;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany(mappedBy = "places")
    private List<Tour> tours = new ArrayList<>();

    // Default constructor required by JPA
    public Place() {
    }

    // Constructor for bootstrapping data
    public Place(String name, String address, String description, PlaceType placeType, Float averageRating, String sentimentTag) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.placeType = placeType;
        this.averageRating = averageRating;
        this.sentimentTag = sentimentTag;
    }
}