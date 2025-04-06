
import React from 'react';

interface LogoImageProps {
  size?: number;
  className?: string;
}

const LogoImage: React.FC<LogoImageProps> = ({ size = 24, className = "" }) => {
  return (
    <img 
      src="/lovable-uploads/31793b77-19f1-47b7-ab82-aec1d0a86f5b.png" 
      alt="Garbage Social Logo" 
      width={size} 
      height={size} 
      className={className}
    />
  );
};

export default LogoImage;
