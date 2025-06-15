
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface SignInRequiredProps {
  onLogin: () => void;
}

const SignInRequired: React.FC<SignInRequiredProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30 rounded-2xl">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-green-700 mb-2 font-quicksand">Sign In Required</h2>
        <p className="text-green-600 mb-4 font-medium">
          Please sign in to generate and customize your FREN avatar
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={onLogin} 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <LogIn className="h-4 w-4" />
            Sign In to Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInRequired;
