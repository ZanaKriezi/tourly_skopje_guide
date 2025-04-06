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
}