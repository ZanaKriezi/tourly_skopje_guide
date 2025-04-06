import React from 'react';
import Card from '../common/Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon 
}) => {
  return (
    <Card className="h-full">
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className="font-poppins text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="font-inter text-text">{description}</p>
    </Card>
  );
};

export default FeatureCard;