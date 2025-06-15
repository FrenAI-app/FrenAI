
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GenerateButtonProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  disabled: boolean;
  onClick: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  hasGenerated,
  disabled,
  onClick
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button 
        onClick={onClick} 
        disabled={isGenerating || disabled}
        className={`${isMobile ? 'w-full text-base py-3 h-12' : 'w-full md:w-64 px-6 py-2'} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg touch-manipulation font-medium`}
      >
        {isGenerating ? (
          <>
            <Loader2 className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />
            {isMobile ? 'Creating...' : 'Generating...'}
          </>
        ) : hasGenerated ? (
          <>
            <RefreshCw className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {isMobile ? 'Create New' : 'Generate New Avatar'}
          </>
        ) : (
          <>
            <Sparkles className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {isMobile ? 'Generate Avatar' : 'Generate Avatar'}
          </>
        )}
      </Button>
      
      {disabled && !isGenerating && (
        <p className={`${isMobile ? 'text-xs px-4' : 'text-sm'} text-gray-500 text-center leading-relaxed`}>
          {isMobile 
            ? 'Add more details to your description' 
            : 'Please provide a detailed description to generate your avatar'
          }
        </p>
      )}
      
      {isMobile && !disabled && !hasGenerated && (
        <p className="text-xs text-center text-gray-400 px-4">
          Tip: Be specific about colors, style, and features for best results
        </p>
      )}
    </div>
  );
};

export default GenerateButton;
