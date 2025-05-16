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
import java.util.Set;

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

    // Updated paginated queries with default sorting by rating
    @Query("SELECT p FROM Place p ORDER BY p.averageRating DESC")
    Page<Place> findAll(Pageable pageable);

    @Query("SELECT p FROM Place p WHERE p.placeType = :placeType ORDER BY p.averageRating DESC")
    Page<Place> findByPlaceType(@Param("placeType") PlaceType placeType, Pageable pageable);

    @Query("SELECT p FROM Place p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.averageRating DESC")
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

    /**
     * Find places by type with minimum rating and review count
     * This is useful for tour generation to ensure quality places
     */
    @Query("SELECT p FROM Place p WHERE p.placeType = :placeType AND p.averageRating >= :minRating AND (p.userRatingsTotal IS NOT NULL AND p.userRatingsTotal > 0) ORDER BY p.averageRating DESC, p.userRatingsTotal DESC")
    List<Place> findPlacesByTypeWithMinRating(@Param("placeType") PlaceType placeType, @Param("minRating") Float minRating);

    /**
     * Find places excluding certain place types
     * Useful to filter out place types that should not be in tours
     */
    @Query("SELECT p FROM Place p WHERE p.placeType NOT IN :excludedTypes ORDER BY p.averageRating DESC")
    List<Place> findPlacesExcludingTypes(@Param("excludedTypes") Set <PlaceType> excludedTypes);

    /**
     * Find places with sentiment analysis
     * This allows finding places with certain sentiment tags for better tour generation
     */
    @Query("SELECT p FROM Place p WHERE p.sentimentTag = :sentimentTag AND p.averageRating >= :minRating ORDER BY p.averageRating DESC")
    List<Place> findPlacesBySentimentTag(@Param("sentimentTag") String sentimentTag, @Param("minRating") Float minRating);

    /**
     * Find places that need AI processing
     * This helps identify places that need sentiment analysis or descriptions
     */
    @Query("SELECT p FROM Place p WHERE p.description IS NULL OR p.description = '' OR p.sentimentTag IS NULL")
    List<Place> findPlacesNeedingAIProcessing();

    /**
     * Find places with high ratings for premium tours
     * For creating high-quality tours with only the best places
     */
    @Query("SELECT p FROM Place p WHERE p.averageRating >= :minRating AND (p.userRatingsTotal IS NOT NULL AND p.userRatingsTotal >= :minReviews) ORDER BY p.averageRating DESC, p.userRatingsTotal DESC")
    List<Place> findHighlyRatedPlaces(@Param("minRating") Float minRating, @Param("minReviews") Integer minReviews);

    /**
     * Find places by type that have sufficient data for AI processing
     * Places with reviews are needed for sentiment analysis
     */
    @Query("SELECT p FROM Place p WHERE p.placeType = :placeType AND p.averageRating >= :minRating AND EXISTS (SELECT r FROM Review r WHERE r.place = p)")
    List<Place> findPlacesWithReviewsByType(@Param("placeType") PlaceType placeType, @Param("minRating") Float minRating);
}