
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TokenRequirementAlertProps {
  canCreateProposal: boolean;
  proposalType: 'standard' | 'critical' | 'emergency';
  userTokenBalance: number;
  minimumTokenRequirement: Record<string, number>;
}

const TokenRequirementAlert: React.FC<TokenRequirementAlertProps> = ({
  canCreateProposal,
  proposalType,
  userTokenBalance,
  minimumTokenRequirement
}) => {
  if (canCreateProposal) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="text-amber-800 font-medium">Insufficient FREN tokens</p>
        <p className="text-amber-700">
          You need at least {minimumTokenRequirement[proposalType].toLocaleString()} FREN tokens 
          to create a {proposalType} proposal. You currently have {userTokenBalance.toLocaleString()} FREN.
        </p>
      </div>
    </div>
  );
};

export default React.memo(TokenRequirementAlert);
