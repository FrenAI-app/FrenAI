import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePrivyAuth } from '@/context/PrivyContext';
import IntroBackground from './intro/IntroBackground';
import IntroSkipButton from './intro/IntroSkipButton';
import IntroDuck from './intro/IntroDuck';
import IntroContent from './intro/IntroContent';

const IntroAnimation = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hasSeenBefore, setHasSeenBefore] = useLocalStorage('has-seen-intro', false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { authenticated, ready } = usePrivyAuth();
  
  // Updated contract address for FREN token
  const contractAddress = "HeLp1ng0urFr3nds1nCryp7oW0rld123456789";
  
  console.log('IntroAnimation rendered:', { visible, hasSeenBefore, ready, authenticated });
  
  // Check if we should show intro - skip for logged users
  useEffect(() => {
    console.log('IntroAnimation effect triggered:', { ready, authenticated, hasSeenBefore, visible });
    if (ready) {
      // Skip intro animation for authenticated users
      if (authenticated) {
        console.log('User is authenticated, skipping intro animation');
        setVisible(false);
        setHasSeenBefore(true);
        
        // Dispatch event to notify that intro is complete
        const event = new CustomEvent('introComplete');
        document.dispatchEvent(event);
        return;
      }
      
      // Show intro for non-authenticated users
      setVisible(true);
      setAnimationStep(0);
      console.log('User not authenticated, showing intro animation');
    }
  }, [ready, authenticated]);
  
  // Handle animation steps automatically
  useEffect(() => {
    if (!visible) return;
    
    console.log('Animation step effect:', animationStep);
    const timer = setTimeout(() => {
      if (animationStep < 4) {
        setAnimationStep(prev => {
          const next = prev + 1;
          console.log('Animation step changed from', prev, 'to', next);
          return next;
        });
      }
    }, animationStep === 0 ? 1000 : 1500);
    
    return () => clearTimeout(timer);
  }, [animationStep, visible]);
  
  // Auto-close intro after sufficient time
  useEffect(() => {
    if (!visible) return;
    
    const autoCloseTimer = setTimeout(() => {
      console.log('Auto-closing intro animation');
      handleAnimationComplete();
    }, 15000); // Longer time to enjoy the animation
    
    return () => clearTimeout(autoCloseTimer);
  }, [visible]);
  
  // Mark as seen and fade out animation
  const handleAnimationComplete = () => {
    console.log('Handling animation complete');
    if (!overlayRef.current) return;
    
    overlayRef.current.classList.add('animate-fade-out-down');
    setTimeout(() => {
      setVisible(false);
      setHasSeenBefore(true);
      
      // Dispatch event to notify that intro is complete
      const event = new CustomEvent('introComplete');
      document.dispatchEvent(event);
      console.log('Intro complete event dispatched');
    }, 1000);
  };
  
  // Skip the animation
  const handleSkip = () => {
    console.log('Skipping intro animation');
    handleAnimationComplete();
  };
  
  console.log('IntroAnimation render decision:', { visible, shouldRender: visible });
  
  if (!visible) {
    console.log('IntroAnimation not visible, returning null');
    return null;
  }
  
  console.log('IntroAnimation rendering with step:', animationStep);
  
  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 via-blue-100 to-purple-200 overflow-hidden mobile-safe-area-top mobile-safe-area-bottom"
    >
      {/* Skip button */}
      <IntroSkipButton onSkip={handleSkip} />
      
      {/* Floating hearts and stars background */}
      <IntroBackground animationStep={animationStep} />
      
      {/* Main content container - centered and responsive */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-4 relative z-10">
        {/* Duck with enhanced effects - better centered */}
        <IntroDuck animationStep={animationStep} />
        
        {/* Enhanced text animation - positioned below the duck */}
        <IntroContent 
          animationStep={animationStep}
          contractAddress={contractAddress}
          onComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
