package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPlaceIdOrderByTimestampDesc(Long placeId, Pageable pageable);
    List<Review> findByUser(User user);
    List<Review> findByPlace(Place place);
    List<Review> findByRatingGreaterThanEqual(Integer rating);
    List<Review> findByRatingLessThanEqual(Integer rating);
    List<Review> findByRatingBetween(Integer minRating, Integer maxRating);
    List<Review> findByCommentContainingIgnoreCase(String comment);
    @Query("SELECT r FROM Review r WHERE r.place.id = ?1")
    Page<Review> findByPlaceId(Long placeId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.place.id = ?1")
    Integer countByPlaceId(Long placeId);
}