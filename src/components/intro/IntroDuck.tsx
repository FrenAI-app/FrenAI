
import { Heart, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface IntroDuckProps {
  animationStep: number;
}

const IntroDuck = ({ animationStep }: IntroDuckProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      relative z-20 transition-all duration-1500 ease-out mb-8
      ${animationStep >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-75'}
      ${animationStep === 2 ? 'animate-bounce-gentle' : ''}
      ${animationStep >= 3 ? 'scale-110' : ''}
    `}>
      {/* Enhanced swirling hearts around duck */}
      <div className="absolute inset-0 animate-spin-slow">
        {[...Array(isMobile ? 6 : 8)].map((_, i) => (
          <div
            key={`swirl-heart-${i}`}
            className={`absolute text-pink-500 transition-all duration-700 ${
              animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              transform: `rotate(${i * (360 / (isMobile ? 6 : 8))}deg) translateY(-${isMobile ? 50 : 70}px)`,
              transformOrigin: 'center center'
            }}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse drop-shadow-lg" />
          </div>
        ))}
      </div>
      
      {/* Additional swirling stars */}
      <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '10s' }}>
        {[...Array(isMobile ? 4 : 6)].map((_, i) => (
          <div
            key={`swirl-star-${i}`}
            className={`absolute text-yellow-400 transition-all duration-700 ${
              animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              transform: `rotate(${i * (360 / (isMobile ? 4 : 6))}deg) translateY(-${isMobile ? 35 : 50}px)`,
              transformOrigin: 'center center'
            }}
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current animate-twinkle drop-shadow-lg" />
          </div>
        ))}
      </div>
      
      {/* Duck image with enhanced magical effects */}
      <div className="relative duck-body">
        {/* Enhanced magical glow */}
        <div className={`
          absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 blur-2xl
          ${animationStep >= 2 ? 'animate-pulse opacity-70' : 'opacity-0'}
        `} />
        
        {/* Secondary glow layer */}
        <div className={`
          absolute inset-0 rounded-full bg-gradient-to-r from-amber-100 via-rose-100 to-violet-100 blur-lg
          ${animationStep >= 2 ? 'magical-glow opacity-50' : 'opacity-0'}
        `} />
        
        <img 
          src="/lovable-uploads/535c1b5f-c4b9-43c9-9c3e-0113c908676d.png"
          alt="Duck Mascot"
          className={`
            relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain z-10
            ${animationStep >= 2 ? 'drop-shadow-2xl' : ''}
            transition-all duration-500
          `}
        />
      </div>
    </div>
  );
};

export default IntroDuck;
