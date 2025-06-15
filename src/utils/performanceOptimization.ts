
// Advanced performance optimization utilities

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  bundleSize: number;
}

// Debounce function for scroll events
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for frequent events
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance monitoring for virtual scrolling
export const measureVirtualScrollPerformance = () => {
  if (!performance.mark) return null;

  const startMark = 'virtual-scroll-start';
  const endMark = 'virtual-scroll-end';
  
  performance.mark(startMark);
  
  return {
    end: () => {
      performance.mark(endMark);
      performance.measure('virtual-scroll-duration', startMark, endMark);
      
      const measure = performance.getEntriesByName('virtual-scroll-duration')[0];
      return measure ? measure.duration : 0;
    }
  };
};

// Memory usage tracking
export const trackMemoryUsage = (): PerformanceMetrics | null => {
  if (!('memory' in performance)) return null;

  const memory = (performance as any).memory;
  return {
    renderTime: performance.now(),
    memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
    fps: 0, // Would need frame timing API
    bundleSize: 0 // Would need resource timing
  };
};

// Intersection Observer with performance optimization
export const createOptimizedIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const optimizedCallback = throttle(callback, 16); // ~60fps

  return new IntersectionObserver(optimizedCallback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Virtualization helpers
export const calculateVisibleRange = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};

// Preload strategy for virtual items
export const preloadVirtualItems = async <T>(
  items: T[],
  visibleRange: { startIndex: number; endIndex: number },
  preloadRange = 5
) => {
  const preloadStart = Math.max(0, visibleRange.startIndex - preloadRange);
  const preloadEnd = Math.min(items.length - 1, visibleRange.endIndex + preloadRange);
  
  const itemsToPreload = items.slice(preloadStart, preloadEnd);
  
  // Implement actual preloading logic based on item type
  return itemsToPreload;
};
