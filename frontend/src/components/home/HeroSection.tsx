import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  title,
  subtitle,
  ctaText,
  ctaLink
}) => {
  return (
    <div 
      className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-text opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
          {title}
        </h1>
        <p className="font-inter text-lg md:text-xl max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        <Link to={ctaLink}>
          <Button variant="primary" size="lg">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;