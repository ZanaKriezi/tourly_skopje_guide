// src/components/layout/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backgroundImage
}) => {
  if (backgroundImage) {
    return (
      <div 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4 text-white">
          <h1 className="font-display font-bold text-4xl mb-3">{title}</h1>
          {description && (
            <p className="text-lg max-w-2xl text-white/90">{description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">{title}</h1>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;