
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Heart, Star } from 'lucide-react';
import RoadmapSection from './fren-token/RoadmapSection';
import HolderBenefitsSection from './fren-token/HolderBenefitsSection';
import CommunitySection from './fren-token/CommunitySection';
import TechnicalDetailsSection from './fren-token/TechnicalDetailsSection';
import FloatingIcon from './fren-token/FloatingIcon';
import DuckHeartAnimation from './fren-token/DuckHeartAnimation';
import HeroSection from './fren-token/HeroSection';
import ParticleBackground from './fren-token/ParticleBackground';

const FrenToken = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated particle background */}
      <ParticleBackground />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8 space-y-16 relative z-10">
        {/* Enhanced floating elements */}
        <FloatingIcon icon={<Heart className="h-6 w-6 text-red-300" />} delay={0} duration={8} />
        <FloatingIcon icon={<Star className="h-5 w-5 text-yellow-300" />} delay={2} duration={10} />
        <FloatingIcon icon={<Heart className="h-4 w-4 text-pink-300" />} delay={4} duration={12} />
        <FloatingIcon icon={<Star className="h-6 w-6 text-amber-300" />} delay={6} duration={9} />
        <FloatingIcon icon={<Heart className="h-5 w-5 text-rose-300" />} delay={1} duration={11} />
        <FloatingIcon icon={<Star className="h-4 w-4 text-orange-300" />} delay={3} duration={7} />
        <FloatingIcon icon={<Heart className="h-3 w-3 text-red-400" />} delay={5} duration={9} />
        <FloatingIcon icon={<Star className="h-3 w-3 text-yellow-400" />} delay={7} duration={11} />
        
        {/* Enhanced Hero Section */}
        <HeroSection />

        {/* Animated separator */}
        <div className="relative py-8">
          <Separator className="my-8 bg-gradient-to-r from-transparent via-amber-300 to-transparent h-0.5 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background px-4">
              <div className="flex items-center gap-2 text-amber-500 animate-bounce">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">Technical Details</span>
                <Star className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <TechnicalDetailsSection />
        
        {/* Animated separator */}
        <div className="relative py-8">
          <Separator className="my-8 bg-gradient-to-r from-transparent via-green-300 to-transparent h-0.5 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background px-4">
              <div className="flex items-center gap-2 text-green-500 animate-bounce">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Holder Benefits</span>
                <Heart className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <HolderBenefitsSection />
        
        {/* Animated separator */}
        <div className="relative py-8">
          <Separator className="my-8 bg-gradient-to-r from-transparent via-blue-300 to-transparent h-0.5 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background px-4">
              <div className="flex items-center gap-2 text-blue-500 animate-bounce">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">Roadmap</span>
                <Star className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <RoadmapSection />
        
        {/* Animated separator */}
        <div className="relative py-8">
          <Separator className="my-8 bg-gradient-to-r from-transparent via-pink-300 to-transparent h-0.5 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background px-4">
              <div className="flex items-center gap-2 text-pink-500 animate-bounce">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">Community</span>
                <Star className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <CommunitySection />
      </div>
    </div>
  );
};

export default FrenToken;
