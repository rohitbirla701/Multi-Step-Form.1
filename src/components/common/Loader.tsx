import React from 'react';
import { Loader2 } from 'lucide-react'; // spinner icon

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoaderProps> = ({ size = 32, fullScreen = false }) => {
  const wrapperClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50'
    : 'flex items-center justify-center';

  return (
    <div className="flex-col gap-4 w-full h-screen flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
      </div>
    </div>
  );
};
