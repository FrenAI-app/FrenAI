
import React from 'react';
import { Sparkles } from 'lucide-react';

const BackgroundParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={`bg-particle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 120 - 10}%`,
            top: `${Math.random() * 120 - 10}%`,
            animation: `magical-sparkle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 opacity-60" />
        </div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
