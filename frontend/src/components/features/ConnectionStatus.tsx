import React from 'react';
import { LoadingState } from '../../types/common';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

interface ConnectionStatusProps {
  status: string;
  state: LoadingState;
  error?: string | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  state, 
  error 
}) => {
  return (
    <div className="my-4">
      <h3 className="font-poppins text-xl mb-2 text-text">Backend Status:</h3>
      
      {state === 'loading' && (
        <div className="bg-neutral p-4 rounded">
          <LoadingSpinner size="sm" className="mr-2 inline-block" /> 
          Checking connection...
        </div>
      )}
      
      {state === 'failed' && error && (
        <Alert type="error" message={error} />
      )}
      
      {state === 'succeeded' && (
        <Alert type="success" message={status} />
      )}
    </div>
  );
};

export default ConnectionStatus;