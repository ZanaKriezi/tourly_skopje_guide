// src/components/common/Input.tsx
import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-primary';
  const disabledStyle = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <div className={`mb-4 ${widthStyle}`}>
      {label && (
        <label htmlFor={inputId} className="block font-medium mb-1 text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`px-4 py-2 border rounded ${errorStyle} ${disabledStyle} focus:outline-none focus:ring-2 ${className}`}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;