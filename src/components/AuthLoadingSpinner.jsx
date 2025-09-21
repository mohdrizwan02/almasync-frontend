'use client';

import { Loader2 } from 'lucide-react';

export const AuthLoadingSpinner = ({ 
  fullScreen = false, 
  message = "Initializing..." 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm" 
    : "w-full py-8";

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600 mb-4" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AuthLoadingSpinner;
