
import React from 'react';
import { Heart, Star } from 'lucide-react';

const DuckHeartAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80">
        <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-400 animate-pulse" fill="currentColor" />
      </div>
      
      <div className="absolute top-2/5 left-3/5 opacity-70">
        <Heart className="h-3 w-3 md:h-4 md:w-4 text-pink-400 animate-bounce" fill="currentColor" />
      </div>
      
      <div className="absolute top-3/5 left-2/5 opacity-80">
        <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-300 animate-pulse" fill="currentColor" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="absolute top-1/2 left-3/5 opacity-70">
        <Heart className="h-3 w-3 md:h-4 md:w-4 text-pink-300 animate-bounce" fill="currentColor" style={{ animationDelay: '0.3s' }} />
      </div>
      
      <div className="absolute top-3/5 left-1/2 opacity-60">
        <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500 animate-pulse" fill="currentColor" style={{ animationDelay: '0.8s' }} />
      </div>
      
      <div className="absolute top-2/5 left-2/5 opacity-50">
        <Heart className="h-3 w-3 md:h-4 md:w-4 text-pink-500 animate-bounce" fill="currentColor" style={{ animationDelay: '0.2s' }} />
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90">
        <Star className="h-3 w-3 md:h-4 md:w-4 text-amber-300 animate-spin" fill="currentColor" style={{ animationDuration: '3s' }} />
      </div>
      
      <div className="absolute top-2/5 left-2/5 opacity-70">
        <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-300 animate-ping" fill="currentColor" />
      </div>
      
      <div className="absolute top-3/5 left-3/5 opacity-60">
        <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-400 animate-spin" fill="currentColor" style={{ animationDuration: '2s' }} />
      </div>
      
      <div className="absolute top-2/5 left-3/5 opacity-80">
        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 animate-pulse" fill="currentColor" />
      </div>
      
      <div className="absolute top-3/5 left-2/5 opacity-60">
        <Star className="h-2 w-2 md:h-3 md:w-3 text-amber-500 animate-ping" fill="currentColor" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default DuckHeartAnimation;
