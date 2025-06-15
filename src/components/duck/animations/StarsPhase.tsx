
import React from 'react';
import { Star } from 'lucide-react';

interface StarsPhaseProps {
  isActive: boolean;
  opacity?: string;
}

const StarsPhase: React.FC<StarsPhaseProps> = ({ isActive, opacity = 'opacity-100' }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <Star
          key={`star-${i}`}
          className={`absolute w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 fill-current ${opacity}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `swirl-stars ${4 + i * 0.2}s ease-out infinite`,
            animationDelay: `${i * 0.1}s`,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  );
};

export default StarsPhase;
