// src/components/common/Input.tsx
import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  disabled,
  id,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-danger-400 focus:ring-danger-500 text-danger-900' : 'border-gray-300 focus:ring-primary-500';
  const disabledStyle = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const iconPaddingLeft = leftIcon ? 'pl-10' : '';
  const iconPaddingRight = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`mb-4 ${widthStyle}`}>
      {label && (
        <label htmlFor={inputId} className="block font-medium text-sm mb-1 text-gray-700">
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-md shadow-sm px-4 py-2 ${iconPaddingLeft} ${iconPaddingRight} ${errorStyle} ${disabledStyle} focus:outline-none focus:ring-2 ${className}`}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-danger-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;