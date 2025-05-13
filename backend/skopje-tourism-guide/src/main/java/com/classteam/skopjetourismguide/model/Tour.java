// Tour.java
package com.classteam.skopjetourismguide.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
@Getter @Setter
@ToString(exclude = {"user", "preference", "places"}) // Prevent toString() recursion
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(nullable = false)
    private LocalDateTime dateCreated = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true) // Only use the ID for serialization
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preference_id", nullable = false)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true) // Only use the ID for serialization
    private Preference preference;

    @ManyToMany
    @JoinTable(
            name = "tour_places_skopje",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "place_id")
    )
    @JsonIgnoreProperties("tours")
    private List<Place> places = new ArrayList<>();

    // Helper methods for managing relationships
    public void addPlace(Place place) {
        places.add(place);
        place.getTours().add(this);
    }

    public void removePlace(Place place) {
        places.remove(place);
        place.getTours().remove(this);
    }
}
