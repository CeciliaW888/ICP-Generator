import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/public/icons/icon-192.png" 
      alt="ICP Generator Logo" 
      className={`h-8 w-8 rounded-md object-contain ${className}`} 
      onError={(e) => {
        // Fallback if image fails to load
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement?.classList.add('fallback-active');
      }}
    />
  );
};