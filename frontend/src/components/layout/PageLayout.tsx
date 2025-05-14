// src/components/layout/PageLayout.tsx
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  withTopPadding?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  withTopPadding = true
}) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Make sure Navbar is always visible */}
      <Navbar />
      {/* Add appropriate padding to prevent content from going behind the fixed navbar */}
      <main className={`flex-grow ${withTopPadding ? 'pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;