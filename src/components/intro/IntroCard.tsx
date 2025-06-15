
import ContractAddressBox from '../fren-token/ContractAddressBox';

interface IntroCardProps {
  animationStep: number;
  contractAddress: string;
}

const IntroCard = ({ animationStep, contractAddress }: IntroCardProps) => {
  return (
    <div className={`transition-all duration-1000 delay-1000 mb-6
      ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="enhanced-glass-card mobile-card rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <img 
            src="/lovable-uploads/c9afc638-2cd2-4b9e-bf75-5196706e457a.png"
            alt="Pump.fun"
            className="h-8 sm:h-10 w-auto drop-shadow-lg"
          />
          <span className="text-green-600 font-bold text-lg sm:text-xl drop-shadow-md">Fren token fair launch!</span>
        </div>
        <p className="mb-3 sm:mb-4 drop-shadow-sm leading-relaxed text-sm sm:text-base mobile-text-optimization font-semibold" style={{ color: '#1e3a8a' }}>
          FREN token is now available on pump.fun with a fair launch mechanism. No presale, no team allocation - 100% community owned!
        </p>
        
        {/* Contract address copy box */}
        <ContractAddressBox contractAddress={contractAddress} />
      </div>
    </div>
  );
};

export default IntroCard;
