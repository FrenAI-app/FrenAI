
import { ChatProvider } from '../context/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePrivyAuth } from '@/context/PrivyContext';
import DuckEntranceController from '@/components/duck/DuckEntranceController';
import MoodBasedDuck from '@/components/MoodBasedDuck';
import AppHeader from '@/components/layout/AppHeader';
import FloatingElements from '@/components/layout/FloatingElements';
import FloatingVoteButton from '@/components/layout/FloatingVoteButton';
import AppTabs from '@/components/layout/AppTabs';
import PoweredBySection from '@/components/PoweredBySection';
import { preloadCriticalAssets, measureBundlePerformance } from '@/utils/bundleOptimization';
import { setupIntelligentPreloading } from '@/utils/routeOptimization';

const Index = () => {
  useEffect(() => {
    // Initialize bundle optimizations
    preloadCriticalAssets();
    setupIntelligentPreloading();
    
    // Measure performance after initial load
    setTimeout(() => {
      measureBundlePerformance();
    }, 2000);
  }, []);

  return (
    <ChatProvider>
      <DuckEntranceController>
        <IndexContent />
      </DuckEntranceController>
    </ChatProvider>
  );
};

const IndexContent = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const { user, authenticated } = usePrivyAuth();
  
  const logoUrl = "/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png";
  
  // Check if user is admin
  const isAdmin = authenticated && user?.email === 'hellofrens@frenai.app';
  
  // Handle tab change to mark announcements as viewed
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'announcements') {
      // Dispatch custom event to mark announcements as viewed
      window.dispatchEvent(new CustomEvent('announcementTabViewed', { detail: 'announcements' }));
    }
  };

  const handleVoteClick = () => {
    setActiveTab('vote');
  };
  
  return (
    <div className={`${isMobile ? 'w-full min-h-screen p-0' : 'container py-8'} relative overflow-hidden`}>
      <FloatingElements />

      <AppHeader logoUrl={logoUrl} />
      
      <FloatingVoteButton 
        activeTab={activeTab} 
        onVoteClick={handleVoteClick} 
      />
      
      <MoodBasedDuck />
      
      <div className={`${isMobile ? 'w-full' : 'max-w-4xl mx-auto'} animate-fade-in relative z-10`}>
        <AppTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isAdmin={isAdmin}
        />
      </div>

      {/* Powered By Section */}
      <PoweredBySection />
    </div>
  );
};

export default Index;
