import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="font-poppins text-xl font-semibold text-primary mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;