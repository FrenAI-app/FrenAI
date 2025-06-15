
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivyProvider from "./context/PrivyContext";
import UserProvider from "./context/UserContext";
import AnimatedBackground from "./components/AnimatedBackground";
import Index from "./pages/Index";
import Announcements from "./pages/Announcements";
import PostAnnouncement from "./pages/PostAnnouncement";
import NotFound from "./pages/NotFound";
import IntroAnimation from "./components/IntroAnimation";
import LightBeamEffect from "./components/LightBeamEffect";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { useIsMobile, useIsIOS, useIsAndroid, useHasNotch } from "./hooks/use-mobile";

const queryClient = new QueryClient();

// Wrapper component to handle intro animation state
const AppContent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  const isAndroid = useIsAndroid();
  const hasNotch = useHasNotch();
  
  // Handle intro completion
  useEffect(() => {
    const handleIntroComplete = () => {
      console.log('Intro animation completed');
      setIntroComplete(true);
      // Add a small delay before hiding to ensure smooth transition
      setTimeout(() => {
        setShowIntro(false);
      }, 500);
    };
    
    document.addEventListener('introComplete', handleIntroComplete);
    
    return () => {
      document.removeEventListener('introComplete', handleIntroComplete);
    };
  }, []);
  
  // Force show intro on mount - always show it initially
  useEffect(() => {
    console.log('AppContent mounted, showIntro:', showIntro);
    setShowIntro(true);
    setIntroComplete(false);
  }, []);

  // Apply mobile-specific classes and optimizations
  useEffect(() => {
    const root = document.documentElement;
    
    // Add device-specific classes
    if (isMobile) {
      root.classList.add('is-mobile');
    } else {
      root.classList.remove('is-mobile');
    }
    
    if (isIOS) {
      root.classList.add('is-ios');
      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, { passive: false });
    } else {
      root.classList.remove('is-ios');
    }
    
    if (isAndroid) {
      root.classList.add('is-android');
      // Add Material Design ripple effects
      root.style.setProperty('--android-ripple-duration', '300ms');
    } else {
      root.classList.remove('is-android');
    }
    
    if (hasNotch) {
      root.classList.add('has-notch');
      // Handle safe area insets
      root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    } else {
      root.classList.remove('has-notch');
    }

    // Set viewport height for mobile browsers
    if (isMobile) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        root.style.setProperty('--vh', `${vh}px`);
        root.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH, { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
      }, { passive: true });
      
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, [isMobile, isIOS, isAndroid, hasNotch]);

  return (
    <div className={`min-h-screen flex flex-col relative ${isMobile ? 'mobile-optimized' : ''} ${isIOS ? 'ios-optimized' : ''} ${isAndroid ? 'android-optimized' : ''}`}>
      {/* Show intro animation on first load */}
      {showIntro && <IntroAnimation />}
      
      {/* Main app content with conditional opacity and mobile optimizations */}
      <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${showIntro && !introComplete ? 'opacity-0' : 'opacity-100'} ${isMobile ? 'mobile-safe-area-top mobile-safe-area-bottom' : ''}`}>
        <AnimatedBackground />
        <LightBeamEffect 
          targetSelector=".duck-body" 
          duration={3000}
          delay={15000} 
          color="rgba(255, 245, 150, 0.6)"
          width={80}
          rainbow={true}
        />
        <BrowserRouter>
          <div className={`flex-1 ${isMobile ? 'mobile-keyboard-aware' : ''}`}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/announcements/post" element={<PostAnnouncement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
};

// Main App component with mobile providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PrivyProvider>
          <UserProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </UserProvider>
        </PrivyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
