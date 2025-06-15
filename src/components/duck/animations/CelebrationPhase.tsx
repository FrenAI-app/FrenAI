
import React from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';

interface CelebrationPhaseProps {
  isActive: boolean;
}

const CelebrationPhase: React.FC<CelebrationPhaseProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0">
      {[...Array(25)].map((_, i) => (
        <div
          key={`celebration-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `celebration-burst ${2 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 1}s`,
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-current" />
          ) : i % 3 === 1 ? (
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
          ) : (
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CelebrationPhase;
