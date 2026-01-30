
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded-md" role="alert">
      <p className="font-bold">Lỗi</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
