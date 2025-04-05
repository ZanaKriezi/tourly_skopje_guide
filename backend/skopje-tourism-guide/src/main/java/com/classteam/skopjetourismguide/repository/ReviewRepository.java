package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUser(User user);
    List<Review> findByPlace(Place place);
    List<Review> findByRatingGreaterThanEqual(Integer rating);
    List<Review> findByRatingLessThanEqual(Integer rating);
    List<Review> findByRatingBetween(Integer minRating, Integer maxRating);
    List<Review> findByCommentContainingIgnoreCase(String comment);
}