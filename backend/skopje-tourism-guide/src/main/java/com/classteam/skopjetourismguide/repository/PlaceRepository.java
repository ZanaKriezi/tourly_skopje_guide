package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository< Place, Long> {
    List <Place> findByPlaceType(PlaceType placeType);
    List<Place> findByAverageRatingGreaterThanEqual(Float rating);
    List<Place> findByNameContainingIgnoreCase(String name);
    List<Place> findByAddressContainingIgnoreCase(String address);
    List<Place> findByDescriptionContainingIgnoreCase(String description);
    List<Place> findBySentimentTagContainingIgnoreCase(String sentimentTag);

    Optional< Place> findByGooglePlaceId(String placeId);
    List<Place> findByPlaceTypeOrderByAverageRatingDesc(PlaceType placeType);
    List<Place> findTop10ByPlaceTypeOrderByAverageRatingDesc(PlaceType placeType);
}
