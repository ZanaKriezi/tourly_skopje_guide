package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Preference;
import com.classteam.skopjetourismguide.model.Tour;
import com.classteam.skopjetourismguide.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByUser(User user);
    List<Tour> findByPreference(Preference preference);
    List<Tour> findByTitleContainingIgnoreCase(String title);
}