
import React from 'react';
import { Smile } from 'lucide-react';

interface DuckInteractionsProps {
  onJokeClick: (e: React.MouseEvent) => void;
}

const DuckInteractions: React.FC<DuckInteractionsProps> = ({ onJokeClick }) => {
  return (
    <div 
      className="absolute -top-6 -right-6 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full p-1 cursor-pointer shadow-sm transition-all duration-200 hover:scale-110"
      onClick={onJokeClick}
      title="Tell me a joke!"
    >
      <Smile className="h-4 w-4" />
    </div>
  );
};

export default DuckInteractions;
