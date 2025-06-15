
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const PoweredBySection = () => {
  const isMobile = useIsMobile();

  const partners = [
    {
      name: 'Solana',
      logo: '/lovable-uploads/7a1dcc31-837f-402d-b154-6d8486402c90.png',
      description: 'High-performance blockchain',
      url: 'https://www.solana.com'
    },
    {
      name: 'Chainlink',
      logo: '/lovable-uploads/5b3429ba-ebe3-48d5-a028-ae819116cb93.png',
      description: 'Decentralized oracle network',
      url: 'https://www.chain.link'
    },
    {
      name: 'Alchemy',
      logo: '/lovable-uploads/d95daa8b-36f9-45ef-bf9e-e1981a70c26b.png',
      description: 'Web3 development platform',
      url: 'https://www.alchemy.com'
    },
    {
      name: 'Supabase',
      logo: '/lovable-uploads/8e1604f8-0262-4715-98f4-0b16f01372b5.png',
      description: 'Technology partner',
      url: 'https://www.supabase.com'
    }
  ];

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`w-full ${isMobile ? 'py-8 px-4' : 'py-12 px-6'} mobile-safe-area-bottom`}>
      <div className={`${isMobile ? 'max-w-full' : 'max-w-6xl mx-auto'}`}>
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-800 mb-3 mobile-text-optimization`}>
            Powered By
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-purple-600 font-medium`}>
            Built with industry-leading technology partners
          </p>
        </div>

        {/* Partners Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'} items-center justify-items-center`}>
          {partners.map((partner, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(partner.url)}
              className={`
                enhanced-glass-card 
                ${isMobile ? 'p-4 h-20' : 'p-6 h-24'} 
                w-full 
                flex 
                items-center 
                justify-center 
                mobile-tap-target
                gpu-accelerated
                transition-all 
                duration-300 
                hover:scale-105 
                active:scale-95
                cursor-pointer
                ${isMobile ? 'android-ripple' : ''}
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                willChange: 'transform'
              }}
              aria-label={`Visit ${partner.name} website`}
            >
              {/* Logo Only */}
              <div className="flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={`
                    ${isMobile ? 'h-8 max-w-20' : 'h-10 max-w-24'} 
                    object-contain 
                    mobile-image-crisp
                    filter drop-shadow-sm
                  `}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoweredBySection;
