import React from 'react';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  link: string;
}

interface CategoryCardProps {
  category: Category;
  onClick?: (id: string) => void;
  isActive?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, isActive = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 text-center cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1 ${
        isActive ? 'border-2 border-primary' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-center mb-4 text-primary">
        {category.icon}
      </div>
      <h3 className="font-poppins font-semibold text-lg">{category.name}</h3>
    </div>
  );
};

interface CategorySectionProps {
  categories: Category[];
  title: string;
  subtitle?: string;
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  title,
  subtitle,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-montserrat font-bold text-3xl text-text mb-3">{title}</h2>
          {subtitle && (
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              category={category}
              onClick={onCategoryChange}
              isActive={activeCategory === category.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;