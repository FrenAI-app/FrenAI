
// Bundle optimization utilities
export const BUNDLE_CONFIG = {
  MAX_CHUNK_SIZE: 244 * 1024, // 244KB recommended max chunk size
  TARGET_CHUNKS: 5, // Target number of chunks for optimal loading
  LAZY_LOAD_THRESHOLD: 100 * 1024, // 100KB - components larger than this should be lazy loaded
};

// Performance monitoring for bundle optimization
export const measureBundlePerformance = () => {
  if ('getEntriesByType' in performance) {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsEntries = entries.filter(entry => entry.name.includes('.js'));
    
    const bundleMetrics = {
      totalJSSize: jsEntries.reduce((total, entry) => total + (entry.transferSize || 0), 0),
      chunkCount: jsEntries.length,
      largestChunk: Math.max(...jsEntries.map(entry => entry.transferSize || 0)),
      loadTime: jsEntries.reduce((total, entry) => total + entry.duration, 0),
    };

    console.log('Bundle Performance Metrics:', bundleMetrics);
    return bundleMetrics;
  }
  return null;
};

// Preload critical resources
export const preloadCriticalAssets = () => {
  const criticalAssets = [
    '/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png', // Duck logo
  ];

  criticalAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Lazy load non-critical assets
export const lazyLoadAsset = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Dynamic import with retry mechanism
export const dynamicImportWithRetry = async <T>(
  importFunc: () => Promise<T>,
  retries = 3
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFunc();
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Import failed after retries');
};
