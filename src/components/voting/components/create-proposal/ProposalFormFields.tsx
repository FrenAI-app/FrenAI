
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProposalFormFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ProposalFormFields: React.FC<ProposalFormFieldsProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-purple-800">
          Proposal Title *
        </label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a clear and concise title for your proposal"
          className="bg-white/50 border-purple-200"
          maxLength={100}
        />
        <p className="text-xs text-purple-600">
          {title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-purple-800">
          Proposal Description *
        </label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Provide a detailed description of your proposal, including the rationale, expected outcomes, and any implementation details"
          className="bg-white/50 border-purple-200 min-h-32"
          maxLength={2000}
        />
        <p className="text-xs text-purple-600">
          {description.length}/2000 characters
        </p>
      </div>
    </>
  );
};

export default React.memo(ProposalFormFields);
