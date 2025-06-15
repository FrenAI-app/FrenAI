
import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import { useIsMobile } from '@/hooks/use-mobile';
import LightBeamEffect from '@/components/LightBeamEffect';

interface AppHeaderProps {
  logoUrl: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ logoUrl }) => {
  const isMobile = useIsMobile();
  const [showBeamEffect, setShowBeamEffect] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogoClick = () => {
    setShowBeamEffect(true);
    setTimeout(() => setShowBeamEffect(false), 2000);
  };

  return (
    <>
      <header className={`flex justify-between items-center ${isMobile ? 'p-4 border-b sticky top-0 bg-white/10 backdrop-blur-md z-20 border-white/20' : 'mb-8'} enhanced-glass-card rounded-xl`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Magical glow around logo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 blur-lg animate-pulse opacity-50" />
            <img 
              src={logoUrl} 
              alt="FrenAI Duck Logo" 
              className="relative h-10 w-10 md:h-12 md:w-12 animate-bounce-in hover:animate-float cursor-pointer flex-shrink-0 drop-shadow-2xl"
              style={{ zIndex: 30 }}
              onClick={handleLogoClick}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-800 bg-clip-text text-transparent leading-tight tracking-wide drop-shadow-lg">
              FrenAI
            </h1>
            <p className="text-xs md:text-sm font-quicksand leading-tight font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent tracking-wider transform hover:scale-105 transition-all duration-300 drop-shadow-md">
              Your friendly AI companion
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {authError && (
            <div className="text-xs text-purple-600 max-w-32 hidden md:block enhanced-glass-card p-2 rounded-lg">
              {authError}
            </div>
          )}
          
          <div className="enhanced-glass-card rounded-md p-0.5">
            <AuthButton />
          </div>
        </div>
      </header>

      <LightBeamEffect 
        active={showBeamEffect} 
        rainbow={true} 
        targetSelector=".duck-body" 
        duration={2000}
      />
    </>
  );
};

export default React.memo(AppHeader);
