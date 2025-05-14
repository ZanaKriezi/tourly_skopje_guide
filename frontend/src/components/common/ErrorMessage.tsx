// src/components/common/ErrorMessage.tsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-danger-50 border border-danger-200 text-danger-700 rounded-lg p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-danger-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <div className="mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="text-danger-700 hover:bg-danger-100"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;