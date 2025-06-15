
import React from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';

interface DuckAppearancePhaseProps {
  isActive: boolean;
}

const DuckAppearancePhase: React.FC<DuckAppearancePhaseProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      {/* Perfect centering container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        
        {/* Duck container with slower, more magical effects */}
        <div className="relative flex-shrink-0 animate-[duck-appear_4s_ease-out_forwards]">
          {/* Enhanced rainbow aura with slower transitions */}
          <div 
            className="absolute inset-0 rounded-full animate-[rainbow-pulse_4s_ease-in-out_infinite]"
            style={{
              transform: 'scale(2.5)',
              transition: 'all 1s ease-out'
            }} 
          />
          
          {/* Duck with enhanced magical glow and slower float - perfectly centered */}
          <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center animate-[gentle-float_6s_ease-in-out_infinite]">
            <img 
              src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
              alt="FrenAI Duck" 
              className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl transition-all duration-1000"
              style={{ 
                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.6))',
              }}
            />
            
            {/* Slower orbiting magical elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`orbit-${i}`}
                className="absolute transition-opacity duration-1000"
                style={{
                  animation: `orbit-magic ${6 + i * 0.8}s linear infinite`,
                  animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                  opacity: 0.9
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
        </div>
      </div>
    </div>
  );
};

export default DuckAppearancePhase;
