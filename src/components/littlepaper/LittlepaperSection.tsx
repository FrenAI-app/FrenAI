
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LittlepaperSectionProps {
  section: {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    content: string;
  };
  isExpanded: boolean;
  onToggle: (sectionId: string) => void;
}

const LittlepaperSection = ({ section, isExpanded, onToggle }: LittlepaperSectionProps) => {
  return (
    <Card className={`border-l-4 ${section.borderColor} shadow-sm hover:shadow-md transition-all duration-300 bg-white`}>
      <CardHeader 
        className={`cursor-pointer bg-gradient-to-r ${section.bgColor} hover:brightness-105 transition-all duration-200`}
        onClick={() => onToggle(section.id)}
      >
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-4">
            <div className={`p-2 bg-white rounded-lg shadow-sm ${section.borderColor} border`}>
              {section.icon}
            </div>
            <div>
              <span className="text-xl font-semibold">{section.title}</span>
              <div className="text-sm text-slate-600 mt-1">
                {isExpanded ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${isExpanded ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {isExpanded ? 'Open' : 'Closed'}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-600" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-6 pb-6">
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
            {section.content}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LittlepaperSection;
