import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '' }) => {
  const typeStyles = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800'
  };
  
  return (
    <div className={`p-3 rounded border ${typeStyles[type]} ${className}`}>
      {message}
    </div>
  );
};

export default Alert;