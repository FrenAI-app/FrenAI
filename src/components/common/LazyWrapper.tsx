
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface LazyWrapperProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <Card className="enhanced-glass-card">
    <CardContent className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <span className="text-purple-700">Loading...</span>
      </div>
    </CardContent>
  </Card>
);

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <DefaultFallback />,
  errorFallback 
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyWrapper;

// Helper function to create lazy components with error boundaries
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};
