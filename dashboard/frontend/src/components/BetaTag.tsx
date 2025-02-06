import React from 'react';

interface BetaTagProps {
  className?: string;
}

const BetaTag: React.FC<BetaTagProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ${className}`}
    >
      BETA
    </span>
  );
};

export default BetaTag;
