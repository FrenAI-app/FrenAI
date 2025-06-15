
import React from 'react';

interface FloatingVoteButtonProps {
  activeTab: string;
  onVoteClick: () => void;
}

const FloatingVoteButton: React.FC<FloatingVoteButtonProps> = ({ activeTab, onVoteClick }) => {
  if (activeTab === 'chat') return null;

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <button
        onClick={onVoteClick}
        className={`enhanced-glass-card rounded-full w-12 h-12 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 ${
          activeTab === 'vote' 
            ? 'bg-purple-600/80 shadow-xl' 
            : 'bg-white/20 hover:bg-white/30'
        }`}
        title="Vote"
      >
        🗳️
      </button>
    </div>
  );
};

export default React.memo(FloatingVoteButton);
