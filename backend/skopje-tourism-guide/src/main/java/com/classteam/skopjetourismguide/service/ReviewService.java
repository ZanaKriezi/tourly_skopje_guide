// ReviewService.java
package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.PageResponseDTO;
import com.classteam.skopjetourismguide.dto.ReviewDTO;
import com.classteam.skopjetourismguide.model.Review;
import com.classteam.skopjetourismguide.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DtoMapper dtoMapper;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, DtoMapper dtoMapper) {
        this.reviewRepository = reviewRepository;
        this.dtoMapper = dtoMapper;
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
}