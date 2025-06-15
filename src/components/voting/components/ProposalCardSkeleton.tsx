
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { useIsMobile } from '@/hooks/use-mobile';

const ProposalCardSkeleton: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Card className="enhanced-glass-card border-white/20 backdrop-blur-md shadow-lg">
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Skeleton className={`${isMobile ? 'h-5' : 'h-6'} w-3/4 mb-2`} />
            <Skeleton className={`${isMobile ? 'h-4' : 'h-5'} w-full mb-1`} />
            <Skeleton className={`${isMobile ? 'h-4' : 'h-5'} w-2/3`} />
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
        {/* Voting Results Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Time remaining skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Metadata skeleton */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Voting buttons skeleton */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProposalCardSkeleton);
