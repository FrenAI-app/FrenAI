
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const VotingHeaderSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
      <Skeleton className={`${isMobile ? 'h-8' : 'h-10'} w-64 mb-4`} />
      <Skeleton className={`${isMobile ? 'h-4' : 'h-5'} w-96 mb-6`} />
      
      <Card className="enhanced-glass-card border-white/20 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VotingTabsSkeleton: React.FC = () => {
  return (
    <div className="flex space-x-1 bg-purple-100/50 p-1 rounded-lg mb-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-10 flex-1" />
      ))}
    </div>
  );
};

export const CreateProposalSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="enhanced-glass-card border-white/20 backdrop-blur-md shadow-lg">
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <Skeleton className={`${isMobile ? 'h-6' : 'h-8'} w-64 mb-2`} />
        <Skeleton className={`${isMobile ? 'h-4' : 'h-5'} w-80`} />
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-6`}>
        {/* Proposal Type */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export const LoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <span className="text-purple-700">{message}</span>
      </div>
    </div>
  );
};

export const ErrorState: React.FC<{ 
  message?: string;
  onRetry?: () => void;
}> = ({ 
  message = "Something went wrong. Please try again.",
  onRetry 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
