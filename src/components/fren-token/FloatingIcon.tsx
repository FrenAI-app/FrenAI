
import React from 'react';

interface FloatingIconProps {
  icon: React.ReactNode;
  delay: number;
  duration: number;
}

const FloatingIcon = ({ icon, delay, duration }: FloatingIconProps) => {
  // Use a simple deterministic function to position icons instead of random numbers
  // This prevents issues during build time by making positions consistent
  const position = {
    top: `${(delay * 10 + 5) % 80 + 5}%`, 
    left: `${(delay * 13 + 10) % 80 + 10}%`,
  };
  
  return (
    <div 
      className="absolute animate-float" 
      style={{ 
        animationDelay: `${delay}s`, 
        animationDuration: `${duration}s`,
        top: position.top,
        left: position.left,
        zIndex: -1,
      }}
    >
      {icon}
    </div>
  );
};

export default FloatingIcon;
