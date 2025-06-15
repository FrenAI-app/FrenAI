
import React, { useState } from 'react';
import { Vote } from 'lucide-react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVotingData } from './hooks/useVotingData';
import DevelopmentNotice from './components/DevelopmentNotice';
import VotingHeader from './components/VotingHeader';
import VotingTabs from './components/VotingTabs';
import ProposalsList from './components/ProposalsList';
import CreateProposal from './CreateProposal';

const VotingInterface: React.FC = () => {
  const { user, authenticated } = usePrivyAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'create'>('active');
  
  const { proposals, setProposals, userTokenBalance } = useVotingData(authenticated);

  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    toast({
      title: "Feature Under Development",
      description: "Voting functionality is currently being developed. Please check back soon!",
      variant: "destructive"
    });
  };

  if (!authenticated) {
    return (
      <div className="text-center py-12">
        <Vote className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-purple-700 mb-2">
          Connect Your Wallet to Vote
        </h3>
        <p className="text-purple-600 mb-6">
          Sign in with your wallet to participate in FREN governance
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto px-6 py-8'} relative`}>
      <DevelopmentNotice />
      <VotingHeader userTokenBalance={userTokenBalance} />
      <VotingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6 relative">
        {/* Blur overlay for development - RESTORED */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-10 rounded-2xl pointer-events-none" />
        
        {activeTab === 'create' ? (
          <CreateProposal 
            userTokenBalance={userTokenBalance}
            onProposalCreated={(proposal) => {
              setProposals(prev => [proposal, ...prev]);
              setActiveTab('active');
            }}
          />
        ) : (
          <ProposalsList
            proposals={proposals}
            activeTab={activeTab}
            onVote={handleVote}
            userTokenBalance={userTokenBalance}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default VotingInterface;
