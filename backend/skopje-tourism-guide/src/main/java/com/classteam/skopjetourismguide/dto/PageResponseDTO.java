// PageResponseDTO.java
package com.classteam.skopjetourismguide.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageResponseDTO<T> {
    private List<T> content;
    private PaginationInfo pagination;

    @Data
    public static class PaginationInfo {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }
}