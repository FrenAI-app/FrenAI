
import { useState, useEffect } from 'react';
import { Proposal } from '../types/Proposal';

export const useVotingData = (authenticated: boolean) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userTokenBalance, setUserTokenBalance] = useState(0);

  useEffect(() => {
    const dummyProposals: Proposal[] = [
      {
        id: '1',
        title: 'Implement Voice Feature for All Users',
        description: 'Proposal to make the new voice interaction feature available to all users by default, improving accessibility and user experience.',
        type: 'standard',
        creator: 'Community Member',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        yesVotes: 12500,
        noVotes: 3200,
        abstainVotes: 800,
        status: 'active',
        requiredQuorum: 5,
        passingThreshold: 50,
        hasUserVoted: false
      },
      {
        id: '2',
        title: 'Community Treasury Allocation for Development',
        description: 'Allocate 100,000 FREN tokens from the community treasury to fund the development of advanced AI learning features and improved personalization.',
        type: 'critical',
        creator: 'Core Team',
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        yesVotes: 45000,
        noVotes: 15000,
        abstainVotes: 5000,
        status: 'active',
        requiredQuorum: 15,
        passingThreshold: 66.7,
        hasUserVoted: false
      },
      {
        id: '3',
        title: 'Partnership with Educational Institutions',
        description: 'Establish partnerships with universities to research ethical AI companion development and share findings with the community.',
        type: 'standard',
        creator: 'Research Committee',
        startTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        yesVotes: 28000,
        noVotes: 8000,
        abstainVotes: 2000,
        status: 'passed',
        requiredQuorum: 5,
        passingThreshold: 50,
        hasUserVoted: true,
        userVote: 'yes'
      }
    ];
    
    setProposals(dummyProposals);
    
    if (authenticated) {
      setUserTokenBalance(Math.floor(Math.random() * 10000) + 1000);
    }
  }, [authenticated]);

  return {
    proposals,
    setProposals,
    userTokenBalance
  };
};
