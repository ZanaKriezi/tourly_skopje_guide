import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  linkText,
  linkTo
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl">
        <h2 className="font-montserrat text-2xl font-bold text-text mb-2 text-center">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-center text-gray-600 mb-6">
            {subtitle}
          </p>
        )}
        
        {children}
        
        {linkText && linkTo && (
          <div className="mt-4 text-center">
            <p className="font-inter text-text">
              {linkText.split('|')[0]}
              <Link to={linkTo} className="text-primary hover:underline ml-1">
                {linkText.split('|')[1]}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;