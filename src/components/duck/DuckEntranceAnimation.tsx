
import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';

interface DuckEntranceAnimationProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
}

const DuckEntranceAnimation: React.FC<DuckEntranceAnimationProps> = ({ 
  isVisible, 
  onAnimationComplete 
}) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    console.log('DuckEntranceAnimation: Starting duck animation sequence');
    
    // Step 1: Duck appears immediately when visible
    console.log('Animation Step 1: Duck appearing');
    setAnimationStep(1);
    
    // Step 2: After 2.6 seconds, start disappearing animation (35% shorter than 4 seconds)
    const disappearTimer = setTimeout(() => {
      console.log('Animation Step 2: Duck starting to disappear');
      setAnimationStep(2);
    }, 2600);
    
    // Step 3: After disappear animation completes (6.5 seconds total - 35% shorter than 10 seconds)
    const completeTimer = setTimeout(() => {
      console.log('DuckEntranceAnimation: Animation complete');
      onAnimationComplete();
    }, 6500);
    
    return () => {
      clearTimeout(disappearTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes duck-smooth-disappear {
          0% { 
            opacity: 1; 
            transform: scale(1) translateY(0px) rotate(0deg); 
            filter: blur(0px);
          }
          30% { 
            opacity: 0.8; 
            transform: scale(0.8) translateY(20px) rotate(5deg); 
            filter: blur(1px);
          }
          60% { 
            opacity: 0.4; 
            transform: scale(0.4) translateY(60px) rotate(-10deg); 
            filter: blur(3px);
          }
          100% { 
            opacity: 0; 
            transform: scale(0.1) translateY(120px) rotate(15deg); 
            filter: blur(6px);
          }
        }
        
        @keyframes gentle-float {
          0% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(5deg); 
          }
          100% { 
            transform: translateY(0px) rotate(0deg); 
          }
        }

        @keyframes text-fade-in {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.8); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0px) scale(1); 
          }
        }

        @keyframes text-fade-out {
          0% { 
            opacity: 1; 
            transform: translateY(0px) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-30px) scale(0.8); 
          }
        }

        @keyframes animated-gradient {
          0% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
          100% { 
            background-position: 0% 50%;
          }
        }

        @keyframes float-hearts {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-25px) rotate(8deg) scale(1.1);
          }
          50% {
            transform: translateY(-15px) rotate(-8deg) scale(0.9);
          }
          75% {
            transform: translateY(-20px) rotate(5deg) scale(1.05);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.3) rotate(90deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          75% {
            opacity: 0.7;
            transform: scale(1.2) rotate(270deg);
          }
        }
      `}</style>
      
      {/* Enhanced gradient background */}
      <div 
        className="fixed inset-0 z-50 transition-all duration-1000"
        style={{
          background: animationStep >= 1 ? 
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.08), transparent)' : 
            'transparent',
          backdropFilter: animationStep >= 1 ? 'blur(3px)' : 'none'
        }}
      >
        
        {/* Animated Hearts - Behind the duck */}
        {animationStep >= 1 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={`heart-${i}`}
                className="absolute text-pink-500 transition-all duration-1000 opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-hearts ${3 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 4}s`,
                  fontSize: `${0.8 + Math.random() * 1}rem`,
                  zIndex: 1
                }}
              >
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current animate-pulse drop-shadow-lg" />
              </div>
            ))}
          </div>
        )}
        
        {/* Animated Stars - Behind the duck */}
        {animationStep >= 1 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-yellow-400 transition-all duration-1000 opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${0.6 + Math.random() * 0.8}rem`,
                  zIndex: 1
                }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current drop-shadow-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Large Duck - appears then smoothly disappears */}
        {animationStep >= 1 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative"
              style={{
                animation: animationStep >= 2 ? 'duck-smooth-disappear 3.9s cubic-bezier(0.4, 0, 0.2, 1)' : 
                          'gentle-float 3s ease-in-out infinite',
                zIndex: 10
              }}
            >
              <img 
                src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
                alt="FrenAI Duck" 
                className="w-80 h-80 object-contain relative z-10"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))'
                }}
              />
            </div>
          </div>
        )}

        {/* FrenAI.app text with UI-matching gradient */}
        {animationStep >= 1 && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              paddingTop: '360px',
              animation: animationStep >= 2 ? 'text-fade-out 3.9s cubic-bezier(0.4, 0, 0.2, 1)' : 
                        'text-fade-in 1s ease-out',
              zIndex: 10
            }}
          >
            <div className="text-center px-4 relative">
              <h1 
                className="relative font-poppins text-6xl md:text-8xl lg:text-9xl font-bold text-transparent leading-tight tracking-wide"
                style={{ 
                  background: 'linear-gradient(-45deg, #9333ea, #ec4899, #7c3aed, #db2777, #9333ea)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  animation: 'animated-gradient 3s ease infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                }}
              >
                FrenAI.app
              </h1>
              <p 
                className="relative text-xl md:text-3xl lg:text-4xl font-quicksand leading-tight font-medium text-transparent tracking-wider mt-4"
                style={{ 
                  background: 'linear-gradient(-45deg, #7c3aed, #ec4899, #9333ea, #db2777)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  animation: 'animated-gradient 2s ease infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              >
                Your friendly AI companion
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DuckEntranceAnimation;
