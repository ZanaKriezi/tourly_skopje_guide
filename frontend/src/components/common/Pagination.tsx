import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ scroll to top
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-2 mt-10">
      {/* Prev */}
      <Button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3"
      >
        ← Prev
      </Button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <Button
            key={page}
            onClick={() => handleClick(page)}
            className={`px-3 ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {page}
          </Button>
        );
      })}

      {/* Next */}
      <Button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3"
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;
