
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { validateInput } from '@/utils/inputValidation';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  const validation = validateInput.avatarPrompt(prompt);
  const isValidPrompt = validation.isValid;
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Remove excessive validation that might block input
    const value = e.target.value;
    setPrompt(value);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Description</h2>
        <span className={`text-sm ${isValidPrompt ? 'text-green-600' : 'text-orange-600'}`}>
          {prompt.trim().length}/10 min characters
        </span>
      </div>
      <Textarea
        placeholder="Describe your avatar in detail (e.g., 'A friendly space explorer duck with a shiny blue astronaut helmet, golden feathers, and a bright smile')"
        value={prompt}
        onChange={handlePromptChange}
        className={`min-h-[100px] w-full transition-colors ${
          prompt.length > 0 && !isValidPrompt 
            ? 'border-red-300 focus:border-red-500' 
            : isValidPrompt 
            ? 'border-green-300 focus:border-green-500'
            : ''
        }`}
      />
      {prompt.length > 0 && !isValidPrompt && (
        <p className="text-sm text-red-600 mt-2">
          {validation.error}
        </p>
      )}
      {isValidPrompt && prompt.length > 0 && (
        <p className="text-sm text-green-600 mt-2">
          Great! Your description looks good.
        </p>
      )}
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-1">💡 Tips for better avatars:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Be specific about colors, clothing, and expressions</li>
          <li>• Include personality traits (friendly, mysterious, confident)</li>
          <li>• Mention accessories or special features</li>
          <li>• Avoid inappropriate or offensive content</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptInput;
