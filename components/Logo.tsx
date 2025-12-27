import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  // ---------------------------------------------------------------------------
  // CUSTOMIZATION INSTRUCTIONS:
  // To use your own image logo:
  // 1. Upload your logo to a public URL or put it in a public folder.
  // 2. Uncomment the <img> tag below and remove the <div> block.
  // ---------------------------------------------------------------------------

  // return (
  //   <img 
  //     src="https://your-domain.com/logo.png" 
  //     alt="Company Logo" 
  //     className={`h-8 w-auto ${className}`} 
  //   />
  // );

  return (
    <div className={`w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-black ${className}`}>
      B
    </div>
  );
};
