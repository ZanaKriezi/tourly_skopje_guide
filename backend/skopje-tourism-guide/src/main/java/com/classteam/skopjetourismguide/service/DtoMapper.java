// DtoMapper.java
package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.*;
import com.classteam.skopjetourismguide.model.Place;
import com.classteam.skopjetourismguide.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public PlaceDTO toPlaceDto(Place place) {
        PlaceDTO dto = new PlaceDTO();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setPlaceType(place.getPlaceType());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setAddress(place.getAddress());
        dto.setAverageRating(place.getAverageRating());
        dto.setPhotoReference(place.getPhotoReference());
        dto.setReviewCount(place.getReviews() != null ? place.getReviews().size() : 0);
        return dto;
    }

    public PlaceDetailDTO toPlaceDetailDto(Place place, List<Review> recentReviews) {
        PlaceDetailDTO dto = new PlaceDetailDTO();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setPlaceType(place.getPlaceType());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setAddress(place.getAddress());
        dto.setPhoneNumber(place.getPhoneNumber());
        dto.setWebsiteURL(place.getWebsiteURL());
        dto.setSocialMedia(place.getSocialMedia());
        dto.setAverageRating(place.getAverageRating());
        dto.setPhotoReference(place.getPhotoReference());
        dto.setSentimentTag(place.getSentimentTag());
        dto.setReviewCount(place.getReviews() != null ? place.getReviews().size() : 0);

        // Map only the recent reviews
        if (recentReviews != null) {
            dto.setRecentReviews(recentReviews.stream()
                    .map(this::toReviewDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public ReviewDTO toReviewDto(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setTimestamp(review.getTimestamp());

        // Only include necessary user info, not the entire user object
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserName(review.getUser().getUsername());
        }

        return dto;
    }

    // Convert Page<Entity> to PageResponseDTO<DTO>
    public <T, D> PageResponseDTO<D> toPageResponse(Page<T> page, List<D> dtoContent) {
        PageResponseDTO<D> response = new PageResponseDTO<>();
        response.setContent(dtoContent);

        PageResponseDTO.PaginationInfo paginationInfo = new PageResponseDTO.PaginationInfo();
        paginationInfo.setPage(page.getNumber());
        paginationInfo.setSize(page.getSize());
        paginationInfo.setTotalElements(page.getTotalElements());
        paginationInfo.setTotalPages(page.getTotalPages());
        paginationInfo.setLast(page.isLast());

        response.setPagination(paginationInfo);
        return response;
    }
}