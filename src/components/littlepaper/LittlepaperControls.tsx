
import React from 'react';
import { Button } from '@/components/ui/button';
import { Expand, Minimize, Download, Share2 } from 'lucide-react';

interface LittlepaperControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const LittlepaperControls = ({ onExpandAll, onCollapseAll }: LittlepaperControlsProps) => {
  return (
    <div className="text-center pt-8 pb-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Documentation Controls</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onExpandAll}
          >
            <Expand className="h-4 w-4 mr-2" />
            Expand All
          </Button>
          
          <Button 
            variant="outline"
            onClick={onCollapseAll}
          >
            <Minimize className="h-4 w-4 mr-2" />
            Collapse All
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            Print
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigator.share ? navigator.share({ title: 'FREN Documentation', url: window.location.href }) : null}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        <p className="text-slate-600 mt-4 text-sm">
          Navigate through the FREN documentation sections to learn about our AI platform's features and capabilities.
        </p>
      </div>
    </div>
  );
};

export default LittlepaperControls;
