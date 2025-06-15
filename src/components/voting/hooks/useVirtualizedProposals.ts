
import { useMemo, useState, useCallback } from 'react';
import type { Proposal } from '../types/Proposal';

interface UseVirtualizedProposalsProps {
  proposals: Proposal[];
  pageSize?: number;
}

export const useVirtualizedProposals = ({ 
  proposals, 
  pageSize = 10 
}: UseVirtualizedProposalsProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedItems, setLoadedItems] = useState(pageSize);

  const paginatedProposals = useMemo(() => {
    return proposals.slice(0, loadedItems);
  }, [proposals, loadedItems]);

  const hasMore = useMemo(() => {
    return loadedItems < proposals.length;
  }, [loadedItems, proposals.length]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setLoadedItems(prev => Math.min(prev + pageSize, proposals.length));
    }
  }, [hasMore, pageSize, proposals.length]);

  const reset = useCallback(() => {
    setCurrentPage(0);
    setLoadedItems(pageSize);
  }, [pageSize]);

  return {
    paginatedProposals,
    hasMore,
    loadMore,
    reset,
    currentPage,
    totalItems: proposals.length,
    loadedItems
  };
};
