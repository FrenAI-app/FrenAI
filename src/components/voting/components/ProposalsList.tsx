
import React, { useState } from 'react';
import AdvancedVirtualizedProposalsList from './AdvancedVirtualizedProposalsList';
import { ErrorState } from './LoadingStates';
import ProposalCardSkeleton from './ProposalCardSkeleton';
import type { Proposal } from '../types/Proposal';

interface ProposalsListProps {
  proposals: Proposal[];
  activeTab: 'active' | 'all' | 'create';
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  userTokenBalance: number;
  loading: boolean;
}

const ProposalsList: React.FC<ProposalsListProps> = ({
  proposals,
  activeTab,
  onVote,
  userTokenBalance,
  loading
}) => {
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false); // Could be connected to actual pagination

  const handleRetry = () => {
    setError(null);
    // Trigger a refetch if needed
    window.location.reload();
  };

  const handleLoadMore = () => {
    // Implement actual load more logic here
    console.log('Loading more proposals...');
  };

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (loading && proposals.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <ProposalCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <AdvancedVirtualizedProposalsList
      proposals={proposals}
      activeTab={activeTab}
      onVote={onVote}
      userTokenBalance={userTokenBalance}
      loading={loading}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
    />
  );
};

export default React.memo(ProposalsList);
