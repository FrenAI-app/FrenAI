
import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnnouncementBadge from '@/components/AnnouncementBadge';
import ChatInterface from '@/components/ChatInterface';
import { 
  LazyAnnouncements,
  LazyVotingInterface,
  LazyAvatarGenerator,
  LazyFrenToken,
  LazyGitBookEmbed,
  LazyCreateProgressAnnouncement
} from '@/utils/lazyRoutes';
import { getTabsConfig, TabConfig } from './AppTabsConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isAdmin: boolean;
}

const AppTabs: React.FC<AppTabsProps> = ({ activeTab, onTabChange, isAdmin }) => {
  const isMobile = useIsMobile();
  const tabsConfig = getTabsConfig(isAdmin);

  const renderTabTrigger = (tab: TabConfig) => {
    const Icon = tab.icon;
    const content = (
      <div className="flex items-center gap-1">
        <Icon className={`h-3 w-3 md:h-4 md:w-4 text-${tab.color}-600`} />
        <span className={`truncate text-${tab.color}-700 font-medium`}>{tab.label}</span>
      </div>
    );

    return (
      <TabsTrigger 
        key={tab.value}
        value={tab.value} 
        className="magical-tab-item flex items-center gap-1 py-3 px-2 md:px-3 md:gap-2 text-xs md:text-sm h-auto rounded-xl"
      >
        {tab.value === 'announcements' ? (
          <AnnouncementBadge>{content}</AnnouncementBadge>
        ) : (
          content
        )}
      </TabsTrigger>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mb-4">
      <TabsList className={`enhanced-glass-card grid ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} w-full mx-auto overflow-x-auto gap-1 p-2 h-auto rounded-2xl border-white/20 backdrop-blur-md`}>
        {tabsConfig.map(renderTabTrigger)}
      </TabsList>
      
      <TabsContent value="chat" className="mt-2 md:mt-4">
        <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
          <ChatInterface />
        </div>
      </TabsContent>
      
      <TabsContent value="announcements" className="mt-0 md:mt-4 -mx-4 md:mx-0">
        <div className={`${isMobile ? 'min-h-screen' : ''} enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md`}>
          <LazyAnnouncements />
        </div>
      </TabsContent>
      
      <TabsContent value="vote" className="mt-2 md:mt-4">
        <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
          <LazyVotingInterface />
        </div>
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="create-announcement" className="mt-2 md:mt-4">
          <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
            <LazyCreateProgressAnnouncement />
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="avatar" className="mt-2 md:mt-4">
        <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
          <LazyAvatarGenerator />
        </div>
      </TabsContent>
      
      <TabsContent value="fren" className="mt-2 md:mt-4">
        <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
          <LazyFrenToken />
        </div>
      </TabsContent>
      
      <TabsContent value="docs" className="mt-2 md:mt-4">
        <div className="enhanced-glass-card rounded-2xl border-white/20 backdrop-blur-md">
          <LazyGitBookEmbed />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default React.memo(AppTabs);
