
import React, { lazy } from 'react';
import { createLazyComponent } from '@/components/common/LazyWrapper';

// Lazy load heavy components with proper fallbacks
export const LazyAnnouncements = createLazyComponent(
  () => import('@/pages/Announcements'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading announcements...</div>
  </div>
);

export const LazyFrenGame = createLazyComponent(
  () => import('@/pages/FrenGame'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading game...</div>
  </div>
);

export const LazyVotingInterface = createLazyComponent(
  () => import('@/components/voting/VotingInterface'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading voting interface...</div>
  </div>
);

export const LazyAvatarGenerator = createLazyComponent(
  () => import('@/components/AvatarGenerator'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading avatar generator...</div>
  </div>
);

export const LazyFrenToken = createLazyComponent(
  () => import('@/components/FrenToken'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading FREN token...</div>
  </div>
);

export const LazyGitBookEmbed = createLazyComponent(
  () => import('@/components/GitBookEmbed'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading documentation...</div>
  </div>
);

export const LazyCreateProgressAnnouncement = createLazyComponent(
  () => import('@/components/CreateProgressAnnouncement'),
  <div className="enhanced-glass-card rounded-2xl p-8 text-center">
    <div className="animate-pulse">Loading announcement creator...</div>
  </div>
);
