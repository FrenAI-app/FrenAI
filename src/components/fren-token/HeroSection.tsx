
import React, { useState, useEffect } from 'react';
import { Sparkles, Coins, Users, TrendingUp } from 'lucide-react';
import DuckHeartAnimation from './DuckHeartAnimation';
import CounterAnimation from './CounterAnimation';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="text-center space-y-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 blur-3xl opacity-50" />
      
      <div className="flex justify-center mb-8 relative z-10">
        <div className={`relative h-32 w-32 md:h-40 md:w-40 transition-all duration-1000 ${isVisible ? 'scale-100' : 'scale-0'}`}>
          <DuckHeartAnimation />
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-20" />
          
          <img 
            src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png" 
            alt="FREN Duck Mascot" 
            className="h-32 w-32 md:h-40 md:w-40 relative z-10 hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
          
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-300 rounded-full opacity-70" />
          <div className="absolute -bottom-2 -left-2 h-3 w-3 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-1/2 -left-4 h-2 w-2 bg-orange-300 rounded-full opacity-80" />
          <div className="absolute top-1/4 -right-4 h-3 w-3 bg-yellow-400 rounded-full opacity-70" />
        </div>
      </div>
      
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-purple-800">
          FREN Token
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-amber-500" />
          <p className="text-xl md:text-2xl text-purple-700 font-medium">
            FREN token is now available on pump.fun with a
          </p>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        
        <p className="text-xl md:text-2xl text-purple-700 font-semibold mb-2">
          fair launch mechanism. No presale, no team
        </p>
        
        <p className="text-xl md:text-2xl text-green-600 font-bold">
          allocation - 100% community owned!
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Coins className="h-8 w-8 text-amber-600" />
            <CounterAnimation target={1000000000} suffix="" className="text-3xl font-bold text-amber-700" />
          </div>
          <p className="text-amber-600 font-medium">Total Supply</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <CounterAnimation target={100} suffix="%" className="text-3xl font-bold text-blue-700" />
          </div>
          <p className="text-blue-600 font-medium">Community Owned</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <CounterAnimation target={0} suffix="%" className="text-3xl font-bold text-green-700" />
          </div>
          <p className="text-green-600 font-medium">Team Allocation</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
