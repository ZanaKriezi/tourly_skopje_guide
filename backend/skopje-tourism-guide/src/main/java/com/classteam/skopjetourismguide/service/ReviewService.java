// ReviewService.java
package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.PageResponseDTO;
import com.classteam.skopjetourismguide.dto.ReviewDTO;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.repository.PlaceRepository;
import com.classteam.skopjetourismguide.repository.ReviewRepository;
import com.classteam.skopjetourismguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DtoMapper dtoMapper;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, DtoMapper dtoMapper, PlaceRepository placeRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.dtoMapper = dtoMapper;
        this.placeRepository = placeRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponseDTO<ReviewDTO> getReviewsByPlaceId(Long placeId, Pageable pageable) {
        Page<Review> reviewsPage = reviewRepository.findByPlaceId(placeId, pageable);

        List<ReviewDTO> reviewDTOs = reviewsPage.getContent().stream()
                .map(dtoMapper::toReviewDto)
                .collect(Collectors.toList());

        return dtoMapper.toPageResponse(reviewsPage, reviewDTOs);
    }

    @Transactional(readOnly = true)
    public Integer getReviewCountForPlace(Long placeId) {
        return reviewRepository.countByPlaceId(placeId);
    }

    @Transactional
    public ReviewDTO createReview(Long placeId, ReviewDTO reviewDTO) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));

        // Find the user (you might want to get the user by ID from reviewDTO)
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create and populate the Review entity
        Review review = new Review();
        review.setPlace(place);
        review.setUser(user);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setTimestamp(LocalDateTime.now());

        // Save the review
        Review saved = reviewRepository.save(review);

        // Map to DTO and return
        return dtoMapper.toReviewDto(saved);
    }

}