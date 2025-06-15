
import React, { useMemo } from 'react';
import ProposalCard from '../ProposalCard';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Proposal } from '../types/Proposal';

interface VirtualizedProposalsListProps {
  proposals: Proposal[];
  activeTab: 'active' | 'all' | 'create';
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  userTokenBalance: number;
  loading: boolean;
}

const VirtualizedProposalsList: React.FC<VirtualizedProposalsListProps> = ({
  proposals,
  activeTab,
  onVote,
  userTokenBalance,
  loading
}) => {
  const isMobile = useIsMobile();

  const filteredProposals = useMemo(() => {
    if (activeTab === 'active') {
      return proposals.filter(p => p.status === 'active');
    }
    return proposals;
  }, [proposals, activeTab]);

  if (filteredProposals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-600">
          {activeTab === 'active' ? 'No active proposals at the moment.' : 'No proposals found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredProposals.map(proposal => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onVote={onVote}
          userTokenBalance={userTokenBalance}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default React.memo(VirtualizedProposalsList);
