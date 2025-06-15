
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface VotingResultsProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

const VotingResults: React.FC<VotingResultsProps> = ({
  yesVotes,
  noVotes,
  abstainVotes
}) => {
  const totalVotes = yesVotes + noVotes + abstainVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-purple-700 font-medium">Voting Results</span>
        <span className="text-purple-600">
          {totalVotes.toLocaleString()} total votes
        </span>
      </div>
      
      <div className="space-y-2">
        {/* Yes votes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-700 font-medium">Yes ({yesPercentage.toFixed(1)}%)</span>
          <span className="text-green-600">{yesVotes.toLocaleString()}</span>
        </div>
        <Progress value={yesPercentage} className="h-2 bg-green-100">
          <div 
            className="h-full bg-green-500 transition-all duration-500 rounded-full"
            style={{ width: `${yesPercentage}%` }}
          />
        </Progress>
        
        {/* No votes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-700 font-medium">No ({noPercentage.toFixed(1)}%)</span>
          <span className="text-red-600">{noVotes.toLocaleString()}</span>
        </div>
        <Progress value={noPercentage} className="h-2 bg-red-100">
          <div 
            className="h-full bg-red-500 transition-all duration-500 rounded-full"
            style={{ width: `${noPercentage}%` }}
          />
        </Progress>
        
        {/* Abstain votes */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">Abstain ({abstainPercentage.toFixed(1)}%)</span>
          <span className="text-gray-600">{abstainVotes.toLocaleString()}</span>
        </div>
        <Progress value={abstainPercentage} className="h-2 bg-gray-100">
          <div 
            className="h-full bg-gray-500 transition-all duration-500 rounded-full"
            style={{ width: `${abstainPercentage}%` }}
          />
        </Progress>
      </div>
    </div>
  );
};

export default React.memo(VotingResults);
