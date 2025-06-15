
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CreateProposalHeader: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-800 flex items-center gap-2`}>
        <Plus className="h-6 w-6" />
        Create New Proposal
      </CardTitle>
      <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'} text-purple-600`}>
        Submit a proposal for the FREN community to vote on
      </CardDescription>
    </>
  );
};

export default React.memo(CreateProposalHeader);
