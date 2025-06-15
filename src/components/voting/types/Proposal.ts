
export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'standard' | 'critical' | 'emergency';
  creator: string;
  startTime: Date;
  endTime: Date;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  status: 'active' | 'passed' | 'failed' | 'pending';
  requiredQuorum: number;
  passingThreshold: number;
  hasUserVoted: boolean;
  userVote?: 'yes' | 'no' | 'abstain';
}
