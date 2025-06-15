
import { Heart, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface IntroBackgroundProps {
  animationStep: number;
}

const IntroBackground = ({ animationStep }: IntroBackgroundProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Love hearts */}
      {[...Array(isMobile ? 10 : 15)].map((_, i) => (
        <div
          key={`heart-${i}`}
          className={`absolute text-pink-500 transition-all duration-1000 ${
            animationStep >= 1 ? 'opacity-100 animate-float-hearts' : 'opacity-0'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            fontSize: isMobile ? `${0.8 + Math.random() * 1}rem` : `${1.2 + Math.random() * 1.5}rem`,
            zIndex: 5
          }}
        >
          <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current animate-pulse drop-shadow-lg" />
        </div>
      ))}
      
      {/* Twinkling stars */}
      {[...Array(isMobile ? 15 : 20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className={`absolute text-yellow-400 transition-all duration-1000 ${
            animationStep >= 1 ? 'opacity-100 animate-twinkle' : 'opacity-0'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            fontSize: isMobile ? `${0.6 + Math.random() * 0.8}rem` : `${0.8 + Math.random() * 1.2}rem`,
            zIndex: 5
          }}
        >
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current drop-shadow-lg" />
        </div>
      ))}
    </div>
  );
};

export default IntroBackground;
