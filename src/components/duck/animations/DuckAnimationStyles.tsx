
import React from 'react';

const DuckAnimationStyles: React.FC = () => {
  return (
    <style>{`
      @keyframes magical-sparkle {
        0% { opacity: 0; transform: scale(0) rotate(0deg); }
        20% { opacity: 1; transform: scale(1.5) rotate(90deg); }
        80% { opacity: 1; transform: scale(1.2) rotate(270deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
      }
      
      @keyframes swirl-stars {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg) translateX(-200px) translateY(200px); 
        }
        20% { 
          opacity: 1; 
          transform: scale(1.2) rotate(120deg) translateX(-100px) translateY(100px); 
        }
        50% { 
          opacity: 1; 
          transform: scale(1) rotate(240deg) translateX(0px) translateY(0px); 
        }
        80% { 
          opacity: 0.8; 
          transform: scale(1.1) rotate(360deg) translateX(50px) translateY(-50px); 
        }
        100% { 
          opacity: 0.6; 
          transform: scale(0.9) rotate(480deg) translateX(150px) translateY(-150px); 
        }
      }
      
      @keyframes swirl-hearts {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg) translateX(200px) translateY(200px); 
        }
        25% { 
          opacity: 1; 
          transform: scale(1.3) rotate(-90deg) translateX(100px) translateY(100px); 
        }
        50% { 
          opacity: 1; 
          transform: scale(1) rotate(-180deg) translateX(0px) translateY(0px); 
        }
        75% { 
          opacity: 0.9; 
          transform: scale(1.2) rotate(-270deg) translateX(-75px) translateY(-75px); 
        }
        100% { 
          opacity: 0.7; 
          transform: scale(1.1) rotate(-360deg) translateX(-150px) translateY(-150px); 
        }
      }
      
      @keyframes modern-portal-1 {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg); 
          box-shadow: 0 0 0 rgba(139, 92, 246, 0);
        }
        50% { 
          opacity: 0.9; 
          transform: scale(1.2) rotate(180deg); 
          box-shadow: 0 0 60px rgba(139, 92, 246, 0.8);
        }
        100% { 
          opacity: 1; 
          transform: scale(1.5) rotate(360deg); 
          box-shadow: 0 0 80px rgba(139, 92, 246, 1);
        }
      }
      
      @keyframes modern-portal-2 {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg); 
          box-shadow: 0 0 0 rgba(236, 72, 153, 0);
        }
        50% { 
          opacity: 0.8; 
          transform: scale(1.1) rotate(-180deg); 
          box-shadow: 0 0 50px rgba(236, 72, 153, 0.7);
        }
        100% { 
          opacity: 0.9; 
          transform: scale(1.3) rotate(-360deg); 
          box-shadow: 0 0 70px rgba(236, 72, 153, 0.9);
        }
      }
      
      @keyframes modern-portal-3 {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg); 
          box-shadow: 0 0 0 rgba(245, 158, 11, 0);
        }
        50% { 
          opacity: 1; 
          transform: scale(1) rotate(180deg); 
          box-shadow: 0 0 40px rgba(245, 158, 11, 0.8);
        }
        100% { 
          opacity: 0.8; 
          transform: scale(1.2) rotate(360deg); 
          box-shadow: 0 0 60px rgba(245, 158, 11, 1);
        }
      }
      
      @keyframes duck-appear {
        0% { 
          opacity: 0; 
          transform: scale(0.1) translateY(200px) rotate(-30deg); 
          filter: blur(20px);
        }
        30% { 
          opacity: 0.8; 
          transform: scale(1.4) translateY(-30px) rotate(10deg); 
          filter: blur(8px);
        }
        60% { 
          opacity: 1; 
          transform: scale(1.1) translateY(15px) rotate(-5deg); 
          filter: blur(2px);
        }
        100% { 
          opacity: 1; 
          transform: scale(1) translateY(0px) rotate(0deg); 
          filter: blur(0px);
        }
      }
      
      @keyframes text-entrance {
        0% { 
          opacity: 0; 
          transform: translateY(50px) scale(0.8); 
        }
        50% { 
          opacity: 0.8; 
          transform: translateY(-10px) scale(1.05); 
        }
        100% { 
          opacity: 1; 
          transform: translateY(0px) scale(1); 
        }
      }
      
      @keyframes subtitle-appear {
        0% { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        100% { 
          opacity: 1; 
          transform: translateY(0px); 
        }
      }
      
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-15px) rotate(2deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
      
      @keyframes rainbow-pulse {
        0%, 100% { 
          box-shadow: 
            0 0 40px rgba(139, 92, 246, 0.8), 
            0 0 80px rgba(236, 72, 153, 0.6), 
            0 0 120px rgba(245, 158, 11, 0.4),
            0 0 160px rgba(34, 197, 94, 0.3);
        }
        25% { 
          box-shadow: 
            0 0 50px rgba(236, 72, 153, 0.8), 
            0 0 90px rgba(245, 158, 11, 0.6), 
            0 0 130px rgba(34, 197, 94, 0.4),
            0 0 170px rgba(139, 92, 246, 0.3);
        }
        50% { 
          box-shadow: 
            0 0 45px rgba(245, 158, 11, 0.8), 
            0 0 85px rgba(34, 197, 94, 0.6), 
            0 0 125px rgba(139, 92, 246, 0.4),
            0 0 165px rgba(236, 72, 153, 0.3);
        }
        75% { 
          box-shadow: 
            0 0 55px rgba(34, 197, 94, 0.8), 
            0 0 95px rgba(139, 92, 246, 0.6), 
            0 0 135px rgba(236, 72, 153, 0.4),
            0 0 175px rgba(245, 158, 11, 0.3);
        }
      }
      
      @keyframes celebration-burst {
        0% { opacity: 1; transform: scale(1) rotate(0deg); }
        50% { opacity: 0.9; transform: scale(2.5) rotate(180deg); }
        100% { opacity: 0; transform: scale(4) rotate(360deg) translateY(-300px); }
      }
      
      @keyframes text-glow {
        0%, 100% { 
          text-shadow: 
            0 0 20px rgba(139, 92, 246, 0.8), 
            0 0 40px rgba(236, 72, 153, 0.5),
            0 0 60px rgba(245, 158, 11, 0.3);
        }
        50% { 
          text-shadow: 
            0 0 30px rgba(236, 72, 153, 1), 
            0 0 50px rgba(245, 158, 11, 0.8),
            0 0 70px rgba(139, 92, 246, 0.6);
        }
      }
      
      @keyframes orbit-magic {
        from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
      }
    `}</style>
  );
};

export default DuckAnimationStyles;
