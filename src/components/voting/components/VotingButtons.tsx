
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import type { Proposal } from '../types/Proposal';

interface VotingButtonsProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  userTokenBalance: number;
  loading: boolean;
}

const VotingButtons: React.FC<VotingButtonsProps> = ({
  proposal,
  onVote,
  userTokenBalance,
  loading
}) => {
  const isActive = proposal.status === 'active';

  if (!isActive) return null;

  return (
    <div className="grid grid-cols-3 gap-2 pt-4">
      <Button
        variant={proposal.userVote === 'yes' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onVote(proposal.id, 'yes')}
        disabled={loading || userTokenBalance === 0}
        className={`${proposal.userVote === 'yes' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 hover:bg-green-50'} text-xs`}
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Yes
      </Button>
      <Button
        variant={proposal.userVote === 'no' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onVote(proposal.id, 'no')}
        disabled={loading || userTokenBalance === 0}
        className={`${proposal.userVote === 'no' ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 hover:bg-red-50'} text-xs`}
      >
        <XCircle className="h-3 w-3 mr-1" />
        No
      </Button>
      <Button
        variant={proposal.userVote === 'abstain' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onVote(proposal.id, 'abstain')}
        disabled={loading || userTokenBalance === 0}
        className={`${proposal.userVote === 'abstain' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} text-xs`}
      >
        <Users className="h-3 w-3 mr-1" />
        Abstain
      </Button>
    </div>
  );
};

export default React.memo(VotingButtons);
