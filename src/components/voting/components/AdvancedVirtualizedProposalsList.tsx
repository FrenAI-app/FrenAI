
import React, { useMemo } from 'react';
import { useAdvancedVirtualScrolling, useInfiniteScroll } from '@/hooks/useAdvancedVirtualScrolling';
import { useIsMobile } from '@/hooks/use-mobile';
import ProposalCard from '../ProposalCard';
import { LoadingSpinner } from './LoadingStates';
import type { Proposal } from '../types/Proposal';

interface AdvancedVirtualizedProposalsListProps {
  proposals: Proposal[];
  activeTab: 'active' | 'all' | 'create';
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  userTokenBalance: number;
  loading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const AdvancedVirtualizedProposalsList: React.FC<AdvancedVirtualizedProposalsListProps> = ({
  proposals,
  activeTab,
  onVote,
  userTokenBalance,
  loading,
  onLoadMore,
  hasMore = false
}) => {
  const isMobile = useIsMobile();

  const filteredProposals = useMemo(() => {
    if (activeTab === 'active') {
      return proposals.filter(p => p.status === 'active');
    }
    return proposals;
  }, [proposals, activeTab]);

  // Dynamic item height based on device
  const itemHeight = isMobile ? 220 : 200;
  const containerHeight = isMobile ? 400 : 600;

  const {
    visibleItems,
    startIndex,
    totalHeight,
    containerRef
  } = useAdvancedVirtualScrolling(filteredProposals, {
    itemHeight,
    containerHeight,
    overscan: 3
  });

  const { loadMoreRef, isFetching } = useInfiniteScroll(
    () => onLoadMore?.(),
    hasMore
  );

  if (filteredProposals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-600">
          {activeTab === 'active' ? 'No active proposals at the moment.' : 'No proposals found.'}
        </p>
      </div>
    );
  }

  // Use regular rendering for small lists
  if (filteredProposals.length <= 5) {
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
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetching && <LoadingSpinner />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${startIndex * itemHeight}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((proposal, index) => (
              <div
                key={proposal.id}
                style={{ height: itemHeight }}
                className="mb-6"
              >
                <ProposalCard
                  proposal={proposal}
                  onVote={onVote}
                  userTokenBalance={userTokenBalance}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetching && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
};

export default React.memo(AdvancedVirtualizedProposalsList);
