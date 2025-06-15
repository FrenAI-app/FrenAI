
import { Button } from '@/components/ui/button';
import IntroCard from './IntroCard';

interface IntroContentProps {
  animationStep: number;
  contractAddress: string;
  onComplete: () => void;
}

const IntroContent = ({ animationStep, contractAddress, onComplete }: IntroContentProps) => {
  return (
    <div className="text-center w-full relative z-10">
      <h1 className={`font-poppins text-2xl sm:text-3xl md:text-5xl font-bold transition-all duration-1000 
        ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-4`}>
        <span className="text-purple-800 drop-shadow-lg">Hello</span>
        <span className="bg-gradient-to-r from-pink-600 to-purple-800 bg-clip-text text-transparent ml-2 drop-shadow-lg">Frens!</span>
      </h1>
      
      <p className={`text-lg sm:text-xl md:text-2xl text-purple-700 transition-all duration-1000 delay-500 
        ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} drop-shadow-md mb-6`}>
        Welcome to your friendly AI companion
      </p>
      
      {/* Enhanced Pump.fun notification with blue text */}
      <IntroCard animationStep={animationStep} contractAddress={contractAddress} />
      
      <div className={`transition-all duration-1000 delay-1500 
        ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <Button 
          onClick={onComplete}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-xl mobile-button"
        >
          Let's Chat!
        </Button>
      </div>
    </div>
  );
};

export default IntroContent;
