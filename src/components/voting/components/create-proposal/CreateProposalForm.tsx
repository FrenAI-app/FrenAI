
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TokenRequirementAlert from './TokenRequirementAlert';
import ProposalTypeSelector from './ProposalTypeSelector';
import ProposalFormFields from './ProposalFormFields';

interface FormData {
  title: string;
  description: string;
  type: 'standard' | 'critical' | 'emergency';
}

interface CreateProposalFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  userTokenBalance: number;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
  formData,
  setFormData,
  userTokenBalance,
  loading,
  onSubmit
}) => {
  const minimumTokenRequirement = {
    standard: 1000,
    critical: 5000,
    emergency: 10000
  };

  const canCreateProposal = userTokenBalance >= minimumTokenRequirement[formData.type];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TokenRequirementAlert
        canCreateProposal={canCreateProposal}
        proposalType={formData.type}
        userTokenBalance={userTokenBalance}
        minimumTokenRequirement={minimumTokenRequirement}
      />

      <ProposalTypeSelector
        selectedType={formData.type}
        onTypeChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
        minimumTokenRequirement={minimumTokenRequirement}
      />

      <ProposalFormFields
        title={formData.title}
        description={formData.description}
        onTitleChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
        onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading || !canCreateProposal || !formData.title.trim() || !formData.description.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating Proposal...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(CreateProposalForm);
