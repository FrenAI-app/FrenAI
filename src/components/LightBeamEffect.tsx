
import React, { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react';

interface LightBeamProps {
  targetSelector?: string;
  active?: boolean;
  duration?: number;
  delay?: number;
  color?: string;
  width?: number;
  opacity?: number;
  rainbow?: boolean;
}

const LightBeamEffect: React.FC<LightBeamProps> = ({
  targetSelector = '.duck-body',
  active = false, // Default to inactive
  duration = 2000,
  delay = 10000,
  color = 'rgba(255, 255, 150, 0.7)',
  width = 60,
  opacity = 0.7,
  rainbow = false
}) => {
  const [isShining, setIsShining] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    type: 'heart' | 'star';
    size: number;
    rotation: number;
    speed: number;
  }>>([]);
  
  // Get target element position and trigger beam effect
  useEffect(() => {
    if (!active) return; // Don't activate if not explicitly set to active
    
    const triggerLightBeam = () => {
      const targetElement = document.querySelector(targetSelector);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
        
        // Create particles (hearts and stars)
        const newParticles = [];
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            id: Date.now() + i,
            x: Math.random() * width - width/2,
            y: Math.random() * rect.top,
            type: Math.random() > 0.5 ? 'heart' : 'star',
            size: 10 + Math.random() * 10,
            rotation: Math.random() * 360,
            speed: 1 + Math.random() * 2
          });
        }
        
        setParticles(newParticles);
        
        // Activate beam
        setIsShining(true);
        
        // Deactivate beam after animation duration
        setTimeout(() => {
          setIsShining(false);
          setParticles([]);
        }, duration);
      }
    };
    
    // Only trigger once when active becomes true, not on a recurring interval
    triggerLightBeam();
    
    // Return empty cleanup function
    return () => {};
  }, [active, targetSelector, duration, width]);
  
  // Update particle positions
  useEffect(() => {
    if (!isShining || particles.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.speed,
        rotation: particle.rotation + 1
      })));
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isShining, particles]);
  
  if (!isShining) return null;

  // Add keyframes for animation
  const keyframes = `
    @keyframes lightBeamFall {
      0% {
        opacity: 0;
        height: 0;
      }
      20% {
        opacity: ${opacity};
      }
      100% {
        opacity: ${opacity * 0.8};
      }
    }
    
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
      100% { transform: translateY(0px) rotate(360deg); }
    }
  `;
  
  // Rainbow gradient for the light beam
  const rainbowGradient = rainbow 
    ? 'linear-gradient(to bottom, transparent, rgba(255,0,0,0.5), rgba(255,165,0,0.5), rgba(255,255,0,0.5), rgba(0,128,0,0.5), rgba(0,0,255,0.5), rgba(75,0,130,0.5), rgba(238,130,238,0.5))'
    : `linear-gradient(to bottom, transparent, ${color})`;
  
  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: position.x - width / 2,
          width: `${width}px`,
          height: `${position.y + position.height}px`,
          background: rainbowGradient,
          opacity,
          pointerEvents: 'none',
          zIndex: 40,
          animation: `lightBeamFall ${duration/1000}s ease-in-out`
        }}
      />
      
      {/* Hearts and Stars */}
      {particles.map(particle => (
        <div 
          key={particle.id}
          style={{
            position: 'fixed',
            top: particle.y,
            left: position.x + particle.x,
            zIndex: 41,
            animation: 'float 3s ease-in-out infinite',
            animationDelay: `${Math.random()}s`,
            transform: `rotate(${particle.rotation}deg)`,
            color: particle.type === 'heart' ? 'red' : 'gold',
            pointerEvents: 'none'
          }}
        >
          {particle.type === 'heart' ? 
            <Heart size={particle.size} fill="red" /> : 
            <Star size={particle.size} fill="gold" />
          }
        </div>
      ))}
    </>
  );
};

export default LightBeamEffect;
