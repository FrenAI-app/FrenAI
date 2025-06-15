
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingElements: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Magical background with floating elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-200 via-blue-100 to-purple-200 -z-10" />
      
      {/* Floating hearts and stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        {/* Love hearts */}
        {[...Array(isMobile ? 8 : 12)].map((_, i) => (
          <div
            key={`bg-heart-${i}`}
            className="absolute text-pink-500 opacity-30 animate-float-hearts"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              fontSize: isMobile ? `${0.6 + Math.random() * 0.8}rem` : `${0.8 + Math.random() * 1.2}rem`,
            }}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current drop-shadow-lg" />
          </div>
        ))}
        
        {/* Twinkling stars */}
        {[...Array(isMobile ? 10 : 15)].map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute text-yellow-400 opacity-40 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: isMobile ? `${0.5 + Math.random() * 0.6}rem` : `${0.6 + Math.random() * 0.8}rem`,
            }}
          >
            <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current drop-shadow-lg" />
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(FloatingElements);
