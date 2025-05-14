// User.java
package com.classteam.skopjetourismguide.model;

import com.classteam.skopjetourismguide.model.enumerations.Gender;
import com.classteam.skopjetourismguide.model.enumerations.Role;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tourly_users")
@Getter @Setter
@ToString(exclude = {"preferences", "reviews", "tours"}) // Prevent toString() recursion
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String surname;
    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("user")
    private List<Preference> preferences = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("user")
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("user")
    private List<Tour> tours = new ArrayList<>();

    // Helper methods to maintain bidirectional relationships
    public void addPreference(Preference preference) {
        preferences.add(preference);
        preference.setUser(this);
    }

    public void removePreference(Preference preference) {
        preferences.remove(preference);
        preference.setUser(null);
    }

    public void addReview(Review review) {
        reviews.add(review);
        review.setUser(this);
    }

    public void removeReview(Review review) {
        reviews.remove(review);
        review.setUser(null);
    }

    public void addTour(Tour tour) {
        tours.add(tour);
        tour.setUser(this);
    }

    public void removeTour(Tour tour) {
        tours.remove(tour);
        tour.setUser(null);
    }
}
