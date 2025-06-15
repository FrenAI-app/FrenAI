
import React, { useState, useEffect } from 'react';
import DuckEntranceAnimation from './DuckEntranceAnimation';
import { usePrivyAuth } from '@/context/PrivyContext';

interface DuckEntranceControllerProps {
  children: React.ReactNode;
}

const DuckEntranceController: React.FC<DuckEntranceControllerProps> = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const { authenticated, ready } = usePrivyAuth();

  useEffect(() => {
    console.log('DuckEntranceController: Component mounted');
    
    // Skip animation for authenticated users
    if (ready && authenticated) {
      console.log('DuckEntranceController: User is authenticated, skipping animation');
      return;
    }
    
    // Show animation after 1 second delay for non-authenticated users
    const timer = setTimeout(() => {
      console.log('DuckEntranceController: Starting duck entrance animation');
      setShowAnimation(true);
    }, 1000);

    return () => {
      console.log('DuckEntranceController: Cleanup timer');
      clearTimeout(timer);
    };
  }, [authenticated, ready]);

  // Listen for manual duck mascot toggle events - but NOT for anchor button
  useEffect(() => {
    const handleDuckToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('DuckEntranceController: Duck toggle event received', customEvent.detail);
      
      // Skip animation for authenticated users
      if (authenticated) {
        console.log('DuckEntranceController: User is authenticated, skipping animation');
        return;
      }
      
      // Only show animation for events that don't have the 'show' property
      // Anchor button events always have show: true/false property
      // Legacy manual toggle events don't have this property
      if (customEvent.detail && !customEvent.detail.hasOwnProperty('show')) {
        console.log('DuckEntranceController: Legacy duck toggle - showing animation');
        setShowAnimation(true);
      } else {
        console.log('DuckEntranceController: Anchor button toggle - skipping animation (show property present)');
      }
    };

    document.addEventListener('toggleDuckMascot', handleDuckToggle);
    
    return () => {
      document.removeEventListener('toggleDuckMascot', handleDuckToggle);
    };
  }, [authenticated]);

  const handleAnimationComplete = () => {
    console.log('DuckEntranceController: Animation completed, hiding animation');
    setShowAnimation(false);
    
    // Dispatch completion event
    const event = new CustomEvent('duckAnimationComplete');
    document.dispatchEvent(event);
  };

  console.log('DuckEntranceController: Render state - showAnimation:', showAnimation, 'authenticated:', authenticated);

  return (
    <>
      {children}
      {showAnimation && !authenticated && (
        <DuckEntranceAnimation 
          isVisible={showAnimation} 
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </>
  );
};

export default DuckEntranceController;
