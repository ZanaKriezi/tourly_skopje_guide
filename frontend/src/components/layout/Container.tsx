// src/components/layout/Container.tsx
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  size = 'lg'
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`container mx-auto px-4 py-6 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;