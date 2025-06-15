
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, Star } from 'lucide-react';

const AnimatedBackground: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  // Effect to track scroll position for parallax effect with performance optimizations
  useEffect(() => {
    const handleScroll = () => {
      if (!window.requestAnimationFrame) {
        setScrollPosition(window.scrollY);
        return;
      }
      
      requestAnimationFrame(() => {
        setScrollPosition(window.scrollY);
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!window.requestAnimationFrame) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 20,
          y: (e.clientY / window.innerHeight) * 20
        });
        return;
      }
      
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 20,
          y: (e.clientY / window.innerHeight) * 20
        });
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);
  
  // Use memoized values for performance
  const orb1Style = React.useMemo(() => ({
    background: 'radial-gradient(circle, rgba(255, 204, 0, 0.5) 0%, rgba(255, 204, 0, 0) 70%)',
    transform: `translate3d(${scrollPosition * 0.02 - mousePosition.x * 0.5}px, ${scrollPosition * 0.01 - mousePosition.y * 0.5}px, 0)`,
    transition: 'transform 0.8s ease-out',
    willChange: 'transform',
    backfaceVisibility: 'hidden' as 'hidden',
  }), [scrollPosition, mousePosition.x, mousePosition.y]);
  
  // Only render additional elements if not on mobile
  const nonMobileElements = React.useMemo(() => {
    if (isMobile) return null;
    
    return (
      <>
        <div 
          className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(255, 180, 0, 0.4) 0%, rgba(255, 180, 0, 0) 70%)',
            transform: `translate3d(${scrollPosition * -0.01 + mousePosition.x * 0.3}px, ${scrollPosition * 0.015 + mousePosition.y * 0.3}px, 0)`,
            transition: 'transform 0.8s ease-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
        
        <div 
          className="absolute top-1/3 right-1/3 w-1/3 h-1/3 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(255, 220, 77, 0.4) 0%, rgba(255, 220, 77, 0) 60%)',
            transform: `translate3d(${scrollPosition * -0.015 + mousePosition.x * 0.2}px, ${scrollPosition * -0.02 - mousePosition.y * 0.2}px, 0)`,
            transition: 'transform 0.8s ease-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
      </>
    );
  }, [isMobile, scrollPosition, mousePosition.x, mousePosition.y]);
  
  // Calculate number of particles and shapes based on device
  const particleCount = isMobile ? 5 : 12;
  const heartCount = isMobile ? 3 : 6;
  const starCount = isMobile ? 4 : 8;
  
  // Generate random heart shapes with different animations
  const heartShapes = React.useMemo(() => {
    return Array(heartCount).fill(0).map((_, i) => (
      <div
        key={`heart-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `floatHeart ${Math.random() * 15 + 20}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
          transform: `scale(${Math.random() * 0.5 + 0.3})`,
          opacity: Math.random() * 0.4 + 0.2,
        }}
      >
        <Heart 
          className="text-pink-300" 
          size={isMobile ? 12 : 16}
          fill="currentColor"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.3))',
          }}
        />
      </div>
    ));
  }, [heartCount, isMobile]);
  
  // Generate random star shapes with different animations
  const starShapes = React.useMemo(() => {
    return Array(starCount).fill(0).map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `floatStar ${Math.random() * 18 + 25}s linear infinite`,
          animationDelay: `${Math.random() * 8}s`,
          transform: `scale(${Math.random() * 0.4 + 0.4}) rotate(${Math.random() * 360}deg)`,
          opacity: Math.random() * 0.5 + 0.2,
        }}
      >
        <Star 
          className="text-yellow-200" 
          size={isMobile ? 10 : 14}
          fill="currentColor"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(255, 245, 157, 0.4))',
          }}
        />
      </div>
    ));
  }, [starCount, isMobile]);
  
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Base gradient background - golden yellow theme */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 234, 128, 0.25) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 204, 0, 0.25) 100%)',
          backgroundSize: '200% 200%',
          animation: isMobile ? 'gentleGradientShift 30s ease-in-out infinite' : 'gentleGradientShift 20s ease-in-out infinite'
        }}
      />
      
      {/* Subtle gradient orbs - very soft and non-flashing */}
      <div 
        className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full opacity-15"
        style={orb1Style}
      />
      
      {nonMobileElements}
      
      {/* Animated particles - reduce number on mobile */}
      <div className="absolute inset-0">
        {Array(particleCount).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `floatParticle ${Math.random() * 20 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 20}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
      
      {/* Animated Hearts */}
      <div className="absolute inset-0">
        {heartShapes}
      </div>
      
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {starShapes}
      </div>
      
      {/* Extremely subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FFCC00\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Subtle gradient overlay at the bottom for better contrast with content */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/70 to-transparent" />
      
      {/* Enhanced animations with heart and star keyframes */}
      <style>
        {`
          @keyframes gentleGradientShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          @keyframes floatParticle {
            0% { transform: translate3d(0, 0, 0); }
            25% { transform: translate3d(10px, -20px, 0); }
            50% { transform: translate3d(-10px, -40px, 0); }
            75% { transform: translate3d(5px, -20px, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          
          @keyframes floatHeart {
            0% { 
              transform: translate3d(0, 0, 0) scale(var(--scale, 1)) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: var(--opacity, 0.3);
            }
            25% { 
              transform: translate3d(15px, -30px, 0) scale(var(--scale, 1)) rotate(-10deg);
            }
            50% { 
              transform: translate3d(-20px, -60px, 0) scale(var(--scale, 1)) rotate(5deg);
            }
            75% { 
              transform: translate3d(10px, -90px, 0) scale(var(--scale, 1)) rotate(-5deg);
            }
            90% {
              opacity: var(--opacity, 0.3);
            }
            100% { 
              transform: translate3d(0, -120px, 0) scale(var(--scale, 1)) rotate(0deg);
              opacity: 0;
            }
          }
          
          @keyframes floatStar {
            0% { 
              transform: translate3d(0, 0, 0) scale(var(--scale, 1)) rotate(0deg);
              opacity: 0;
            }
            15% {
              opacity: var(--opacity, 0.4);
            }
            25% { 
              transform: translate3d(-10px, -25px, 0) scale(var(--scale, 1)) rotate(90deg);
            }
            50% { 
              transform: translate3d(25px, -50px, 0) scale(var(--scale, 1)) rotate(180deg);
            }
            75% { 
              transform: translate3d(-15px, -75px, 0) scale(var(--scale, 1)) rotate(270deg);
            }
            85% {
              opacity: var(--opacity, 0.4);
            }
            100% { 
              transform: translate3d(0, -100px, 0) scale(var(--scale, 1)) rotate(360deg);
              opacity: 0;
            }
          }
          
          /* Fix for Safari/Mobile */
          @supports (-webkit-touch-callout: none) {
            .opacity-15 {
              opacity: 0.15;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedBackground;
