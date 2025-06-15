
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ProposalTypeSelectorProps {
  selectedType: 'standard' | 'critical' | 'emergency';
  onTypeChange: (value: 'standard' | 'critical' | 'emergency') => void;
  minimumTokenRequirement: Record<string, number>;
}

const ProposalTypeSelector: React.FC<ProposalTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  minimumTokenRequirement
}) => {
  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'standard':
        return 'Regular community proposals - 5% quorum, simple majority (50%)';
      case 'critical':
        return 'Important changes affecting core functionality - 15% quorum, supermajority (66.7%)';
      case 'emergency':
        return 'Urgent proposals requiring immediate action - 25% quorum, simple majority (50%)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-800">
        Proposal Type *
      </label>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="bg-white/50 border-purple-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Standard
              </Badge>
              <span className="text-xs text-gray-600">
                {minimumTokenRequirement.standard.toLocaleString()} FREN required
              </span>
            </div>
          </SelectItem>
          <SelectItem value="critical">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Critical
              </Badge>
              <span className="text-xs text-gray-600">
                {minimumTokenRequirement.critical.toLocaleString()} FREN required
              </span>
            </div>
          </SelectItem>
          <SelectItem value="emergency">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Emergency
              </Badge>
              <span className="text-xs text-gray-600">
                {minimumTokenRequirement.emergency.toLocaleString()} FREN required
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          {getTypeDescription(selectedType)}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ProposalTypeSelector);
