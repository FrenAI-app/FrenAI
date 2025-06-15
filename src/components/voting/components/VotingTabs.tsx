
import React from 'react';
import { Button } from '@/components/ui/button';
import { Vote, Clock } from 'lucide-react';

interface VotingTabsProps {
  activeTab: 'active' | 'all' | 'create';
  onTabChange: (tab: 'active' | 'all' | 'create') => void;
}

const VotingTabs: React.FC<VotingTabsProps> = React.memo(({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      <Button
        variant={activeTab === 'active' ? 'default' : 'outline'}
        onClick={() => onTabChange('active')}
        className={`${activeTab === 'active' ? 'bg-purple-600 hover:bg-purple-700' : ''} flex-shrink-0`}
        disabled
      >
        <Vote className="h-4 w-4 mr-2" />
        Active Proposals
      </Button>
      <Button
        variant={activeTab === 'all' ? 'default' : 'outline'}
        onClick={() => onTabChange('all')}
        className={`${activeTab === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''} flex-shrink-0`}
        disabled
      >
        <Clock className="h-4 w-4 mr-2" />
        All Proposals
      </Button>
      <Button
        variant={activeTab === 'create' ? 'default' : 'outline'}
        onClick={() => onTabChange('create')}
        className={`${activeTab === 'create' ? 'bg-purple-600 hover:bg-purple-700' : ''} flex-shrink-0`}
        disabled
      >
        Create Proposal
      </Button>
    </div>
  );
});

VotingTabs.displayName = 'VotingTabs';

export default VotingTabs;
