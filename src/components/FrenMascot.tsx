
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrivyAuth } from '@/context/PrivyContext';
import { useUser } from '@/context/UserContext';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Position = {
  x: number;
  y: number;
};

type Animation = 'idle' | 'jumping' | 'celebrate' | 'clicked';

const FrenMascot: React.FC = () => {
  const isMobile = useIsMobile();
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [animation, setAnimation] = useState<Animation>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [clickAnimation, setClickAnimation] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivyAuth();
  const { profile } = useUser();
  const [hasSeenIntro] = useLocalStorage('has-seen-intro', false);
  
  // Show mascot after intro animation has been seen
  useEffect(() => {
    if (hasSeenIntro) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenIntro]);

  // Listen for intro completion
  useEffect(() => {
    const handleIntroComplete = () => {
      setIsVisible(true);
    };
    
    document.addEventListener('introComplete', handleIntroComplete);
    
    return () => {
      document.removeEventListener('introComplete', handleIntroComplete);
    };
  }, []);

  // Position mascot above chat input
  useEffect(() => {
    const positionAboveChatInput = () => {
      const chatContainer = document.querySelector('.enhanced-glass-card');
      
      if (chatContainer) {
        const containerRect = chatContainer.getBoundingClientRect();
        
        // Position above the input container
        setPosition({
          x: containerRect.width - (isMobile ? 80 : 100), // Right side with margin
          y: containerRect.height - (isMobile ? 120 : 140) // Above input with margin
        });
      }
    };

    if (isVisible) {
      positionAboveChatInput();
      
      // Reposition on window resize
      window.addEventListener('resize', positionAboveChatInput);
      return () => window.removeEventListener('resize', positionAboveChatInput);
    }
  }, [isVisible, isMobile]);

  // Show welcome message when user connects
  useEffect(() => {
    if (user && !showMessage && isVisible) {
      const username = profile?.username || 'Fren';
      displayMessage(`Hi ${username}!`);
      setAnimation('celebrate');
      setTimeout(() => setAnimation('idle'), 1500);
    }
  }, [user, profile, showMessage, isVisible]);

  // Memoized message display
  const displayMessage = useCallback((text: string) => {
    setMessage(text);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  }, []);

  // Handle click on mascot
  const handleClick = useCallback(() => {
    const messages = [
      "Hi! 😊",
      "Need help?",
      "Click around!",
      "Get some FREN tokens!",
      "Let's explore!",
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    displayMessage(randomMessage);
    
    const clickAnimations: Animation[] = ['jumping', 'celebrate', 'clicked'];
    const randomAnimation = clickAnimations[Math.floor(Math.random() * clickAnimations.length)];
    
    setAnimation(randomAnimation);
    setTimeout(() => setAnimation('idle'), 1200);
  }, [displayMessage]);

  // Toggle visibility with click animation
  const toggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    const animations = ['animate-bounce', 'animate-pulse', 'animate-ping', 'animate-spin'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    setClickAnimation(randomAnim);
    
    setTimeout(() => setClickAnimation(''), 800);
    
    if (isVisible) {
      displayMessage("Bye for now!");
      setTimeout(() => setIsVisible(false), 1000);
    } else {
      setIsVisible(true);
      displayMessage("Hello! I'm from FrenAI.app!");
      setAnimation('celebrate');
      setTimeout(() => setAnimation('idle'), 1500);
    }
  }, [isVisible, displayMessage]);

  return (
    <>
      {/* Actual mascot positioned above chat input */}
      {isVisible && (
        <div 
          ref={containerRef}
          style={{ 
            position: 'absolute', 
            left: `${position.x}px`, 
            bottom: `${isMobile ? '80px' : '100px'}`, // Fixed position above input
            zIndex: 30,
            transform: isMobile ? 'scale(0.7)' : 'scale(0.8)', 
            transformOrigin: 'bottom center',
            transition: 'all 0.3s ease'
          }}
          className="select-none pointer-events-auto"
        >
          {/* Speech bubble */}
          {showMessage && (
            <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border border-amber-200 rounded-lg p-2 shadow-lg ${isMobile ? 'text-xs min-w-[80px] max-w-[120px]' : 'text-xs min-w-[100px] max-w-[150px]'} animate-fade-in`}>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-r border-b border-amber-200"></div>
              {message}
            </div>
          )}
          
          {/* Mascot character */}
          <div 
            onClick={handleClick}
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
          >
            <div className={`
              ${animation === 'idle' && 'animate-pulse-gentle'}
              ${animation === 'jumping' && 'animate-jump'}
              ${animation === 'celebrate' && 'animate-bounce'}
              ${animation === 'clicked' && 'animate-pulse'}
            `}>
              <img 
                src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
                alt="FrenAI Mascot"
                width={isMobile ? "50" : "60"}
                height={isMobile ? "50" : "60"}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FrenMascot;
