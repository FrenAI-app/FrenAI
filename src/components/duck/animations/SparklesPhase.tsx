
import React from 'react';
import { Sparkles, Star, Heart, Zap } from 'lucide-react';

interface SparklesPhaseProps {
  isActive: boolean;
}

const SparklesPhase: React.FC<SparklesPhaseProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0">
      {/* Enhanced opening sparkles with more variety */}
      {[...Array(25)].map((_, i) => {
        const IconComponent = [Sparkles, Star, Heart, Zap][i % 4];
        return (
          <IconComponent
            key={`opening-sparkle-${i}`}
            className="absolute w-6 h-6 sm:w-8 sm:h-8 text-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `magical-sparkle ${1.5 + i * 0.08}s ease-out forwards`,
              animationDelay: `${i * 0.06}s`,
              color: ['#FBBF24', '#EC4899', '#8B5CF6', '#10B981'][i % 4],
            }}
          />
        );
      })}
      
      {/* Additional energy bursts for more engagement */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`energy-burst-${i}`}
          className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `magical-sparkle ${2 + i * 0.1}s ease-out forwards`,
            animationDelay: `${0.5 + i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparklesPhase;
