
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import ProposalHeader from './components/ProposalHeader';
import VotingResults from './components/VotingResults';
import ProposalMetadata from './components/ProposalMetadata';
import VotingButtons from './components/VotingButtons';
import type { Proposal } from './types/Proposal';

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: 'yes' | 'no' | 'abstain') => void;
  userTokenBalance: number;
  loading: boolean;
}

const ProposalCard = ({ proposal, onVote, userTokenBalance, loading }: ProposalCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="enhanced-glass-card border-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all">
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <ProposalHeader proposal={proposal} />
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-4`}>
        <VotingResults 
          yesVotes={proposal.yesVotes}
          noVotes={proposal.noVotes}
          abstainVotes={proposal.abstainVotes}
        />

        <ProposalMetadata proposal={proposal} />

        <VotingButtons
          proposal={proposal}
          onVote={onVote}
          userTokenBalance={userTokenBalance}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
