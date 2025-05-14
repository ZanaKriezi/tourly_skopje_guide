// src/components/common/Button.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Variant styles
  const variantStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-sm",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-sm",
  };
  
  // Size styles
  const sizeStyles = {
    xs: "text-xs px-2.5 py-1.5",
    sm: "text-sm px-3 py-2",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  
  // Other conditional styles
  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;