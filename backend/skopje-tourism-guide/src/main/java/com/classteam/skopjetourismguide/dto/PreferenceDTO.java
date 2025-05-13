package com.classteam.skopjetourismguide.dto;

import com.classteam.skopjetourismguide.model.enumerations.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PreferenceDTO {
    private Long id;
    private String description;
    private TourLength tourLength;
    private BudgetLevel budgetLevel;
    private Boolean includeShoppingMalls = false;
    private List<FoodType> foodTypePreferences = new ArrayList<>();
    private List<DrinkType> drinkTypePreferences = new ArrayList<>();
    private List<AttractionType> attractionTypePreferences = new ArrayList<>();
}
