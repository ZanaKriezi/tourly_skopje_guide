package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    // Keep existing methods
    List<Place> findByPlaceType(PlaceType placeType);
    List<Place> findByAverageRatingGreaterThanEqual(Float rating);
    List<Place> findByNameContainingIgnoreCase(String name);
    List<Place> findByAddressContainingIgnoreCase(String address);
    List<Place> findByDescriptionContainingIgnoreCase(String description);
    List<Place> findBySentimentTagContainingIgnoreCase(String sentimentTag);
    Optional<Place> findByGooglePlaceId(String placeId);
    List<Place> findByPlaceTypeOrderByAverageRatingDesc(PlaceType placeType);
    List<Place> findTop10ByPlaceTypeOrderByAverageRatingDesc(PlaceType placeType);

    // Paginated versions - FIXED by using @Query instead of EntityGraph
    @Query("SELECT p FROM Place p")
    Page<Place> findAll(Pageable pageable);

    @Query("SELECT p FROM Place p WHERE p.placeType = :placeType")
    Page<Place> findByPlaceType(@Param("placeType") PlaceType placeType, Pageable pageable);

    @Query("SELECT p FROM Place p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Place> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    // Place with ID query
    @Query("SELECT p FROM Place p WHERE p.id = :id")
    Optional<Place> findPlaceById(@Param("id") Long id);

    // Reviews with limit using native query
    @Query(value = "SELECT * FROM reviews_skopje r WHERE r.place_id = :placeId ORDER BY r.timestamp DESC LIMIT :limit",
            nativeQuery = true)
    List<Review> findTopNReviewsByPlaceId(@Param("placeId") Long placeId, @Param("limit") int limit);

    // Count reviews
    @Query("SELECT COUNT(r) FROM Review r WHERE r.place.id = :placeId")
    int countReviewsByPlaceId(@Param("placeId") Long placeId);

    // For fetching a place with minimal data (no relationships)
    @Query("SELECT p FROM Place p WHERE p.id = :id")
    Optional<Place> findPlaceWithMinimalData(@Param("id") Long id);
}