
import React, { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton-loader';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  if (imageError) {
    return (
      <div className={cn("bg-purple-100 flex items-center justify-center", className)}>
        <span className="text-purple-600 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!imageLoaded && (
        <Skeleton 
          className={cn(
            "absolute inset-0 z-10",
            placeholderClassName || className
          )} 
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          imageLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default React.memo(ProgressiveImage);
