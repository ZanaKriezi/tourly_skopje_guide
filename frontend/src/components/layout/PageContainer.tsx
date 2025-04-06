import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <main className={`container mx-auto py-8 px-4 ${className}`}>
      {children}
    </main>
  );
};

export default PageContainer;