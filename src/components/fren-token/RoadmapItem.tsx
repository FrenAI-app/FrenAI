
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Star } from 'lucide-react';

interface RoadmapItemProps {
  phase: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming' | 'new-chapter';
  items: string[];
}

const RoadmapItem = ({ phase, title, status, items }: RoadmapItemProps) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    active: 'bg-amber-100 text-amber-800 border-amber-200',
    upcoming: 'bg-gray-100 text-gray-800 border-gray-200',
    'new-chapter': 'bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 text-yellow-900 border-yellow-300 shadow-lg'
  };

  const getBadgeContent = () => {
    switch (status) {
      case 'completed':
        return '✓ Complete';
      case 'active':
        return '🔄 Active';
      case 'upcoming':
        return '📅 Upcoming';
      case 'new-chapter':
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-600" />
            <span>New Chapter</span>
            <Star className="h-3 w-3 text-yellow-600" />
          </div>
        );
      default:
        return 'Unknown';
    }
  };

  const getBadgeVariant = () => {
    if (status === 'new-chapter') {
      return 'default';
    }
    return status === 'completed' ? 'default' : status === 'active' ? 'secondary' : 'outline';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]} transition-all hover:shadow-md ${status === 'new-chapter' ? 'hover:shadow-xl' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg">{phase}</h4>
          <p className="font-medium">{title}</p>
        </div>
        <Badge variant={getBadgeVariant()} className={status === 'new-chapter' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md' : ''}>
          {getBadgeContent()}
        </Badge>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadmapItem;
