
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import CreateProposalHeader from './components/create-proposal/CreateProposalHeader';
import CreateProposalForm from './components/create-proposal/CreateProposalForm';
import type { Proposal } from './types/Proposal';

interface CreateProposalProps {
  userTokenBalance: number;
  onProposalCreated: (proposal: Proposal) => void;
}

const CreateProposal = ({ userTokenBalance, onProposalCreated }: CreateProposalProps) => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'standard' as 'standard' | 'critical' | 'emergency'
  });

  const minimumTokenRequirement = {
    standard: 1000,
    critical: 5000,
    emergency: 10000
  };

  const canCreateProposal = userTokenBalance >= minimumTokenRequirement[formData.type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateProposal) {
      toast({
        title: "Insufficient Tokens",
        description: `You need at least ${minimumTokenRequirement[formData.type].toLocaleString()} FREN tokens to create a ${formData.type} proposal`,
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        creator: 'You',
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        yesVotes: 0,
        noVotes: 0,
        abstainVotes: 0,
        status: 'active',
        requiredQuorum: formData.type === 'emergency' ? 25 : formData.type === 'critical' ? 15 : 5,
        passingThreshold: formData.type === 'critical' ? 66.7 : 50,
        hasUserVoted: false
      };
      
      onProposalCreated(newProposal);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'standard'
      });
      
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted to the blockchain and is now live for voting",
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="enhanced-glass-card border-white/20 backdrop-blur-md shadow-lg">
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CreateProposalHeader />
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
        <CreateProposalForm
          formData={formData}
          setFormData={setFormData}
          userTokenBalance={userTokenBalance}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default CreateProposal;
