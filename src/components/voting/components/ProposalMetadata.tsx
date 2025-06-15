
import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Proposal } from '../types/Proposal';

interface ProposalMetadataProps {
  proposal: Proposal;
}

const ProposalMetadata: React.FC<ProposalMetadataProps> = ({ proposal }) => {
  const isActive = proposal.status === 'active';
  const timeRemaining = isActive ? Math.max(0, proposal.endTime.getTime() - Date.now()) : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <>
      {/* Time remaining */}
      {isActive && (
        <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50/50 rounded-lg p-3">
          <Clock className="h-4 w-4" />
          <span>
            {daysRemaining > 0 ? `${daysRemaining}d ` : ''}
            {hoursRemaining}h remaining
          </span>
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-purple-600 pt-2 border-t border-purple-200/50">
        <span>Created by {proposal.creator}</span>
        <span>•</span>
        <span>{format(proposal.startTime, 'MMM d, yyyy')}</span>
        {proposal.hasUserVoted && (
          <>
            <span>•</span>
            <span className="text-green-600 font-medium">
              You voted: {proposal.userVote?.toUpperCase()}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(ProposalMetadata);
