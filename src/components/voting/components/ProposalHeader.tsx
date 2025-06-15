
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Proposal } from '../types/Proposal';

interface ProposalHeaderProps {
  proposal: Proposal;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposal }) => {
  const isMobile = useIsMobile();
  
  const getStatusColor = () => {
    switch (proposal.status) {
      case 'active': return 'blue';
      case 'passed': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = () => {
    switch (proposal.type) {
      case 'standard': return 'blue';
      case 'critical': return 'orange';
      case 'emergency': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (proposal.status) {
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'active': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-purple-800 mb-2`}>
          {proposal.title}
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'} text-purple-600`}>
          {proposal.description}
        </CardDescription>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Badge 
          variant="secondary" 
          className={`bg-${getStatusColor()}-100 text-${getStatusColor()}-800 border-${getStatusColor()}-200`}
        >
          {getStatusIcon()}
          <span className="ml-1 capitalize">{proposal.status}</span>
        </Badge>
        <Badge 
          variant="outline" 
          className={`bg-${getTypeColor()}-50 text-${getTypeColor()}-700 border-${getTypeColor()}-200`}
        >
          {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)}
        </Badge>
      </div>
    </div>
  );
};

export default React.memo(ProposalHeader);
