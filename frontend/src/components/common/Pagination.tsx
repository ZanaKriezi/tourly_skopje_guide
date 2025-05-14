// src/components/common/Pagination.tsx
import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // If there's only 1 page, don't render pagination
  if (totalPages <= 1) return null;

  // Calculate page numbers to show
  const getPageNumbers = (): number[] => {
    // Maximum number of pages to show (excluding prev/next buttons)
    const maxPages = 5;
    
    if (totalPages <= maxPages) {
      // If total pages is less than maxPages, show all
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    // Always show first, last, current and a page before and after current (if possible)
    const pages: number[] = [0]; // First page
    
    // Middle pages
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);
    
    // Adjust range if we're at the beginning or end
    if (start <= 1) {
      end = Math.min(maxPages - 2, totalPages - 2);
    }
    if (end >= totalPages - 2) {
      start = Math.max(1, totalPages - maxPages + 1);
    }
    
    // Add ellipsis if needed
    if (start > 1) {
      pages.push(-1); // -1 indicates ellipsis
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (end < totalPages - 2) {
      pages.push(-1); // -1 indicates ellipsis
    }
    
    // Add last page
    pages.push(totalPages - 1);
    
    return pages;
  };

  return (
    <div className={`flex justify-center items-center flex-wrap gap-2 ${className}`}>
      {/* Prev */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        variant="outline"
        size="sm"
        className="px-2"
      >
        ← Prev
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        // Render ellipsis
        if (page === -1) {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-1">
              ...
            </span>
          );
        }
        
        // Render page button
        return (
          <Button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? 'primary' : 'outline'}
            size="sm"
            className="px-3 py-1"
          >
            {page + 1}
          </Button>
        );
      })}

      {/* Next */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        variant="outline"
        size="sm"
        className="px-2"
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;