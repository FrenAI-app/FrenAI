
import React from 'react';
import { Heart } from 'lucide-react';

interface HeartsPhaseProps {
  isActive: boolean;
  opacity?: string;
}

const HeartsPhase: React.FC<HeartsPhaseProps> = ({ isActive, opacity = 'opacity-100' }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <Heart
          key={`heart-${i}`}
          className={`absolute w-5 h-5 sm:w-7 sm:h-7 text-pink-400 fill-current ${opacity}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `swirl-hearts ${5 + i * 0.3}s ease-out infinite`,
            animationDelay: `${i * 0.15}s`,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  );
};

export default HeartsPhase;
