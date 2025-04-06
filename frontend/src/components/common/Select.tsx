import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  fullWidth = true,
  className = '',
  disabled,
  id,
  onChange,
  required,
  ...props
}, ref) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-red-400 focus:ring-red-500' : 'border-neutral focus:ring-primary';
  const disabledStyle = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`mb-4 ${widthStyle}`}>
      {label && (
        <label htmlFor={selectId} className="block font-poppins font-medium mb-2 text-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full px-4 py-3 h-12 border rounded ${errorStyle} ${disabledStyle} focus:outline-none focus:ring-2 ${className}`}
        disabled={disabled}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;