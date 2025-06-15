
import React from 'react';
import { DuckEmotion } from './DuckEmotions';

interface DuckSVGProps {
  emotion: DuckEmotion;
  direction: 'left' | 'right';
  targetPosition: { x: number; y: number } | null;
}

const DuckSVG: React.FC<DuckSVGProps> = ({ emotion, direction, targetPosition }) => {
  return (
    <div className={`duck-body ${targetPosition ? 'animate-walk' : 'animate-idle'}`}>
      <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Duck body gradients and filters */}
        <defs>
          <radialGradient id="duckBodyGradient" cx="0.5" cy="0.5" r="0.7" fx="0.35" fy="0.35">
            <stop offset="0%" stopColor="#FFEA80" />
            <stop offset="80%" stopColor="#FFCC00" />
            <stop offset="100%" stopColor="#FF9500" />
          </radialGradient>
          
          <linearGradient id="billGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9500" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000044" />
          </filter>
        </defs>
        
        {/* Anime-style Duck Body */}
        <g filter="url(#shadowFilter)">
          <circle cx="100" cy="100" r="70" fill="url(#duckBodyGradient)" />
          <ellipse cx="70" cy="75" rx="18" ry="15" fill="#FFF0A0" opacity="0.8" />
          <ellipse cx="130" cy="75" rx="18" ry="15" fill="#FFF0A0" opacity="0.8" />
          <circle cx="75" cy="60" r="5" fill="white" opacity="0.9" />
          <circle cx="125" cy="60" r="5" fill="white" opacity="0.9" />
        </g>
        
        {/* Duck bill */}
        <g transform="translate(0, 5)">
          <ellipse cx="100" cy="110" rx="25" ry="14" fill="url(#billGradient)" strokeWidth="2.5" stroke="#FF5500" />
          <ellipse cx="100" cy="112" rx="22" ry="8" fill="#FF7700" opacity="0.7" />
          <ellipse cx="90" cy="108" rx="3" ry="2" fill="#663300" />
          <ellipse cx="110" cy="108" rx="3" ry="2" fill="#663300" />
        </g>
        
        {/* Different eye expressions based on emotion */}
        {emotion === 'happy' && (
          <>
            <ellipse cx="70" cy="85" rx="12" ry="14" fill="black" />
            <ellipse cx="130" cy="85" rx="12" ry="14" fill="black" />
            <ellipse cx="74" cy="80" rx="5" ry="6" fill="white" />
            <ellipse cx="134" cy="80" rx="5" ry="6" fill="white" />
            <path d="M85 125 Q100 135 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        
        {emotion === 'laughing' && (
          <>
            <path d="M60 85 Q70 75 80 85" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M120 85 Q130 75 140 85" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M85 125 Q100 140 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
            <path d="M70 100 Q80 110 90 100" stroke="#FF9955" strokeWidth="3" />
            <path d="M110 100 Q120 110 130 100" stroke="#FF9955" strokeWidth="3" />
          </>
        )}
        
        {emotion === 'cool' && (
          <>
            <rect x="55" y="78" width="30" height="15" rx="5" fill="#000000" stroke="#4488FF" strokeWidth="2" />
            <rect x="115" y="78" width="30" height="15" rx="5" fill="#000000" stroke="#4488FF" strokeWidth="2" />
            <path d="M85 85 L115 85" stroke="#4488FF" strokeWidth="3" />
            <path d="M85 125 Q100 130 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
            <path d="M60 83 L70 83" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
            <path d="M120 83 L130 83" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
          </>
        )}
        
        {emotion === 'sad' && (
          <>
            <ellipse cx="70" cy="85" rx="12" ry="14" fill="#000066" />
            <ellipse cx="130" cy="85" rx="12" ry="14" fill="#000066" />
            <path d="M85 125 Q100 115 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
            <path d="M55 70 Q60 60 65 70" stroke="#88CCFF" strokeWidth="3" fill="#AADDFF" />
            <path d="M55 70 L55 95" stroke="#88CCFF" strokeWidth="3" />
            <ellipse cx="55" cy="95" rx="5" ry="7" fill="#AADDFF" stroke="#88CCFF" strokeWidth="2" />
          </>
        )}
        
        {emotion === 'angry' && (
          <>
            <path d="M60 85 L78 95" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <path d="M122 95 L140 85" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <path d="M85 125 Q100 115 115 125" stroke="#DD0000" strokeWidth="4" strokeLinecap="round" />
            <path d="M55 70 L75 80" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <path d="M125 80 L145 70" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        
        {emotion === 'love' && (
          <>
            <path d="M60 80 C65 70 75 70 80 80 C85 70 95 70 100 80 C105 90 90 100 80 96 C70 100 55 90 60 80 Z" fill="#FF0066" stroke="#FF0044" strokeWidth="2" />
            <path d="M120 80 C125 70 135 70 140 80 C145 70 155 70 160 80 C165 90 150 100 140 96 C130 100 115 90 120 80 Z" fill="#FF0066" stroke="#FF0044" strokeWidth="2" />
            <path d="M85 125 Q100 140 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        
        {emotion === 'sleeping' && (
          <>
            <path d="M65 85 Q70 80 75 85 Q80 90 85 85" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <path d="M125 85 Q130 80 135 85 Q140 90 145 85" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <path d="M85 125 Q100 130 115 125" stroke="#FF5500" strokeWidth="4" strokeLinecap="round" />
            <circle cx="115" cy="110" r="10" fill="#AADDFF" stroke="#88CCFF" strokeWidth="2" opacity="0.9" />
            <text x="135" y="60" fontSize="24" fill="#5D5FEF" fontWeight="bold">z</text>
            <text x="145" y="45" fontSize="30" fill="#5D5FEF" fontWeight="bold">Z</text>
          </>
        )}
        
        {emotion === 'surprised' && (
          <>
            <circle cx="70" cy="85" r="15" fill="white" stroke="black" strokeWidth="3" />
            <circle cx="130" cy="85" r="15" fill="white" stroke="black" strokeWidth="3" />
            <circle cx="70" cy="85" r="8" fill="black" />
            <circle cx="130" cy="85" r="8" fill="black" />
            <circle cx="73" cy="82" r="3" fill="white" />
            <circle cx="133" cy="82" r="3" fill="white" />
            <circle cx="100" cy="125" r="12" fill="#FF6B00" stroke="#FF5500" strokeWidth="2" />
            <text x="45" y="50" fontSize="36" fill="#5D5FEF" fontWeight="bold">!</text>
          </>
        )}
        
        {/* Duck head tuft */}
        <path d="M80 35 Q100 15 120 35" stroke="#FFEA80" strokeWidth="12" strokeLinecap="round" />
        
        {/* Wings */}
        <g className="wing left" style={{ transform: direction === 'left' ? 'translateX(-8px)' : 'translateX(0)' }}>
          <ellipse cx="45" cy="100" rx="18" ry="30" fill="#FFCC00" stroke="#FF9500" strokeWidth="3" opacity={direction === 'left' ? "0.95" : "0.2"} />
        </g>
        
        <g className="wing right" style={{ transform: direction === 'right' ? 'translateX(8px)' : 'translateX(0)' }}>
          <ellipse cx="155" cy="100" rx="18" ry="30" fill="#FFCC00" stroke="#FF9500" strokeWidth="3" opacity={direction === 'right' ? "0.95" : "0.2"} />
        </g>
      </svg>
    </div>
  );
};

export default DuckSVG;
