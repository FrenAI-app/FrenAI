import React, { lazy } from 'react';
import { dynamicImportWithRetry } from './bundleOptimization';

// Optimized route-based code splitting
export const createOptimizedRoute = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
) => {
  return lazy(() => 
    dynamicImportWithRetry(importFunc).catch(error => {
      console.error(`Failed to load ${componentName}:`, error);
      // Fallback to a simple error component with proper typing
      return {
        default: ((() => (
          <div className="enhanced-glass-card rounded-2xl p-8 text-center">
            <div className="text-red-600">
              Failed to load {componentName}. Please refresh the page.
            </div>
          </div>
        )) as unknown as T)
      };
    })
  );
};

// Preload routes based on user behavior
export const preloadRoute = (routeImport: () => Promise<any>) => {
  // Use requestIdleCallback if available, fallback to setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      routeImport().catch(() => {
        // Silently fail preloading
      });
    });
  } else {
    setTimeout(() => {
      routeImport().catch(() => {
        // Silently fail preloading
      });
    }, 2000);
  }
};

// Intelligent preloading based on tab visibility
export const setupIntelligentPreloading = () => {
  const tabsConfig = [
    { tab: 'announcements', import: () => import('@/pages/Announcements') },
    { tab: 'vote', import: () => import('@/components/voting/VotingInterface') },
    { tab: 'avatar', import: () => import('@/components/AvatarGenerator') },
    { tab: 'fren', import: () => import('@/components/FrenToken') },
    { tab: 'docs', import: () => import('@/components/GitBookEmbed') },
  ];

  // Listen for tab hover events to preload content
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const tabTrigger = target.closest('[data-value]');
    
    if (tabTrigger) {
      const tabValue = tabTrigger.getAttribute('data-value');
      const config = tabsConfig.find(c => c.tab === tabValue);
      
      if (config) {
        preloadRoute(config.import);
      }
    }
  });
};
