package com.classteam.skopjetourismguide.model;

import com.classteam.skopjetourismguide.model.enumerations.AttractionType;
import com.classteam.skopjetourismguide.model.enumerations.BudgetLevel;
import com.classteam.skopjetourismguide.model.enumerations.DrinkType;
import com.classteam.skopjetourismguide.model.enumerations.FoodType;
import com.classteam.skopjetourismguide.model.enumerations.TourLength;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preferences")
@Data
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private TourLength tourLength;

    @Enumerated(EnumType.STRING)
    private BudgetLevel budgetLevel;

    private Boolean includeShoppingMalls;

    @ElementCollection
    @CollectionTable(name = "preference_food_types", joinColumns = @JoinColumn(name = "preference_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "food_type")
    private List<FoodType> foodTypePreferences = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "preference_drink_types", joinColumns = @JoinColumn(name = "preference_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "drink_type")
    private List<DrinkType> drinkTypePreferences = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "preference_attraction_types", joinColumns = @JoinColumn(name = "preference_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "attraction_type")
    private List<AttractionType> attractionTypePreferences = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "preference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tour> tours = new ArrayList<>();
}