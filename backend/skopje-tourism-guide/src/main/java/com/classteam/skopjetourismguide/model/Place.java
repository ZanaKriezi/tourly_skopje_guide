// Place.java
package com.classteam.skopjetourismguide.model;

import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "places_skopje")
@Getter
@Setter
@ToString(exclude = {"reviews", "tours"}) // Prevent toString() recursion
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private PlaceType placeType;

    @Column(unique = true, columnDefinition = "TEXT")
    private String googlePlaceId;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String vicinity;

    @Column(columnDefinition = "TEXT")
    private String photoReference;

    private Boolean openNow;

    private Integer userRatingsTotal;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String websiteURL;

    @Column(columnDefinition = "TEXT")
    private String socialMedia;

    private Float averageRating;

    @Column(columnDefinition = "TEXT")
    private String sentimentTag;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("place")
    private List<Review> reviews = new ArrayList<>();

    @ManyToMany(mappedBy = "places")
    @JsonIgnoreProperties("places")
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

    // Helper methods to maintain bidirectional relationship
    public void addReview(Review review) {
        reviews.add(review);
        review.setPlace(this);
    }

    public void removeReview(Review review) {
        reviews.remove(review);
        review.setPlace(null);
    }
}

