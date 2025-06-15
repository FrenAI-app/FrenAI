import React, { useState, useEffect, useRef } from 'react';

console.log('DuckMascot: Starting imports');

import { usePrivyAuth } from '@/context/PrivyContext';
import { useUser } from '@/context/UserContext';
import DuckEmotions, { DuckEmotion } from './duck/DuckEmotions';
import DuckSVG from './duck/DuckSVG';
import { useDuckBehavior } from './duck/useDuckBehavior';
import { useDuckMovement } from './duck/hooks/useDuckMovement';

console.log('DuckMascot: All imports completed successfully');

const DuckMascot: React.FC = () => {
  console.log('DuckMascot: Component initializing');
  
  const [isVisible, setIsVisible] = useState(false);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivyAuth();
  const { profile } = useUser();
  
  const {
    emotion,
    setEmotion,
    reactToUserMood,
    emotionTimeoutRef,
    userMoodActiveRef
  } = useDuckBehavior();

  const {
    position,
    targetPosition,
    direction,
    setDirection,
    handleDragStart,
    handleDragEnd
  } = useDuckMovement(isVisible);

  // Check if we should initialize as visible based on localStorage
  useEffect(() => {
    const storedVisibility = localStorage.getItem('duckMascotVisible');
    if (storedVisibility === 'true') {
      setIsVisible(true);
    }
  }, []);

  // Listen for custom toggle event from ChatInterface
  useEffect(() => {
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      
      // Check if this is a manual anchor button toggle
      if (customEvent.detail && customEvent.detail.show !== undefined) {
        const shouldShow = customEvent.detail.show;
        
        // Direct toggle without animation for anchor button
        setIsVisible(shouldShow);
        localStorage.setItem('duckMascotVisible', String(shouldShow));
        
        if (shouldShow) {
          setEmotion('happy');
        }
      } else {
        // Legacy toggle behavior (with animation)
        setIsVisible(prev => {
          const newState = !prev;
          localStorage.setItem('duckMascotVisible', String(newState));
          
          if (newState && !prev) {
            setShowEntranceAnimation(true);
            return false; // Don't show duck yet, show animation first
          }
          return newState;
        });
      }
    };

    document.addEventListener('toggleDuckMascot', handleToggle);
    
    return () => {
      document.removeEventListener('toggleDuckMascot', handleToggle);
    };
  }, [setEmotion]);

  // Listen for animation completion
  useEffect(() => {
    const handleAnimationComplete = () => {
      setShowEntranceAnimation(false);
      setIsVisible(true);
      localStorage.setItem('duckMascotVisible', 'true');
      setEmotion('happy');
    };

    document.addEventListener('duckAnimationComplete', handleAnimationComplete);
    
    return () => {
      document.removeEventListener('duckAnimationComplete', handleAnimationComplete);
    };
  }, [setEmotion]);

  // PRIORITY: Instant mood change listener - processes immediately
  useEffect(() => {
    const handleMoodChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.mood && isVisible) {
        console.log('Duck: PRIORITY mood change detected:', customEvent.detail.mood);
        // INSTANT reaction - no delays
        reactToUserMood(customEvent.detail.mood);
      }
    };
    
    // Use capture phase for immediate processing
    document.addEventListener('userMoodChanged', handleMoodChange, true);
    return () => {
      document.removeEventListener('userMoodChanged', handleMoodChange, true);
    };
  }, [isVisible, reactToUserMood]);

  // Reduced frequency automatic emotion changes - only when user mood is not active
  useEffect(() => {
    if (!isVisible) return;

    const emotions: DuckEmotion[] = ['happy', 'cool', 'sleeping'];
    const changeEmotion = () => {
      // Only change emotion if user mood is not active
      if (!userMoodActiveRef.current) {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setEmotion(randomEmotion);
      }

      // Longer intervals to give user mood priority
      const timeout = Math.floor(Math.random() * 20000) + 20000; // 20-40 seconds
      emotionTimeoutRef.current = setTimeout(changeEmotion, timeout);
    };

    // Only start automatic changes if no user mood is active
    if (!emotionTimeoutRef.current && !userMoodActiveRef.current) {
      emotionTimeoutRef.current = setTimeout(changeEmotion, 15000);
    }
    
    return () => {
      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
        emotionTimeoutRef.current = null;
      }
    };
  }, [isVisible, setEmotion, userMoodActiveRef, emotionTimeoutRef]);

  // Handle click on mascot - only if user mood is not active
  const handleClick = () => {
    if (!userMoodActiveRef.current) {
      console.log('Duck: Clicked - changing emotion');
      setEmotion('laughing');
      
      // Return to happy after a short time
      setTimeout(() => {
        if (!userMoodActiveRef.current) {
          setEmotion('happy');
        }
      }, 2000);
    } else {
      console.log('Duck: Click ignored - user mood has priority');
    }
    
    // Add jump animation regardless
    if (Math.random() > 0.5) {
      const duckElement = containerRef.current?.querySelector('.duck-body');
      if (duckElement) {
        duckElement.classList.add('animate-jump');
        setTimeout(() => {
          duckElement.classList.remove('animate-jump');
        }, 800);
      }
    }
  };

  return (
    <>
      {isVisible && (
        <div 
          ref={containerRef}
          style={{ 
            position: 'absolute', 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            zIndex: 50,
            transform: `scale(0.8)`, 
            transformOrigin: 'bottom center',
            transition: 'transform 0.2s ease'
          }}
          className="select-none relative"
        >
          {/* Emoji container with proper positioning */}
          <div className="relative w-16 h-16">
            <DuckEmotions emotion={emotion} direction={direction} />
            
            <div 
              draggable 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={handleClick}
              className={`cursor-pointer transform ${direction === 'left' ? 'scale-x-[-1]' : ''} relative`}
              style={{ transformOrigin: 'center' }}
            >
              <DuckSVG 
                emotion={emotion} 
                direction={direction} 
                targetPosition={targetPosition}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

console.log('DuckMascot: Component definition complete');

export default DuckMascot;
