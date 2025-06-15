
import React from 'react';
import { Smile } from 'lucide-react';

interface DuckMessagesProps {
  showMessage: boolean;
  message: string;
  jokeMode: boolean;
}

const DuckMessages: React.FC<DuckMessagesProps> = ({ showMessage, message, jokeMode }) => {
  if (!showMessage) return null;

  return (
    <div className={`absolute bottom-full mb-1 bg-amber-50 border-2 border-amber-400 rounded-lg p-3 shadow-lg text-sm min-w-[180px] max-w-[260px] animate-fade-in ${jokeMode ? 'min-h-[80px]' : ''}`}>
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-amber-50 border-r-2 border-b-2 border-amber-400"></div>
      <p className={`text-center font-medium text-amber-800 ${jokeMode ? 'text-xs' : ''}`}>{message}</p>
      
      {jokeMode && (
        <div className="absolute top-2 right-2 text-yellow-500 animate-pulse-gentle">
          <Smile className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default DuckMessages;
