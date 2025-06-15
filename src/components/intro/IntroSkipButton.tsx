
import { X } from 'lucide-react';

interface IntroSkipButtonProps {
  onSkip: () => void;
}

const IntroSkipButton = ({ onSkip }: IntroSkipButtonProps) => {
  return (
    <button 
      className="absolute top-4 right-4 p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300 z-10 backdrop-blur-sm mobile-button"
      onClick={onSkip}
      aria-label="Skip introduction"
    >
      <X className="w-5 h-5 text-gray-700" />
    </button>
  );
};

export default IntroSkipButton;
