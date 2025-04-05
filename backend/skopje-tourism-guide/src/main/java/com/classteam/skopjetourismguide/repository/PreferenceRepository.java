package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Preference;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.enumerations.BudgetLevel;
import com.classteam.skopjetourismguide.model.enumerations.TourLength;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    List<Preference> findByUser(User user);
    List<Preference> findByBudgetLevel(BudgetLevel budgetLevel);
    List<Preference> findByTourLength(TourLength tourLength);
    List<Preference> findByIncludeShoppingMalls(Boolean includeShoppingMalls);
}