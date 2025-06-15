import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Trophy, Star, Sparkles, Clock, Fuel } from 'lucide-react';

const HolderBenefitsSection = () => {
  const holderBenefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Premium AI Access",
      description: "Unlock advanced AI models, extended conversation memory, and priority response times",
      color: "text-blue-600"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Governance Rights",
      description: "Vote on platform features, AI personality development, and treasury allocation decisions",
      color: "text-amber-600"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Exclusive Features",
      description: "Early access to beta features, custom AI personalities, and advanced analytics",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-amber-500" />
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Holder Benefits & Utility
          </h2>
          <Sparkles className="h-8 w-8 text-orange-500" />
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Exciting utility and exclusive benefits planned for FREN holders
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Coming Soon</span>
          </div>
          <p className="text-blue-700 text-sm">
            These features are currently in development and will be available to FREN holders in upcoming releases.
          </p>
        </div>
      </div>

      {/* Featured Gas Token Card */}
      <Card className="relative overflow-hidden border-2 border-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        {/* Golden glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-400/30 to-orange-400/20 animate-pulse"></div>
        
        <CardHeader className="relative z-10 pb-3 bg-gradient-to-r from-yellow-100 to-amber-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg">
                <Fuel className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600 animate-pulse" />
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow-lg">
                  FEATURED UTILITY
                </span>
                <Sparkles className="h-5 w-5 text-amber-600 animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-700 via-amber-700 to-orange-700 bg-clip-text text-transparent">
            Gas Token for Fren Network
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-4">
          <p className="text-gray-800 leading-relaxed text-lg font-medium mb-4">
            FREN will serve as the native gas token for the upcoming Fren Network - a revolutionary blockchain designed specifically for AI interactions and decentralized applications.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-800 font-medium text-sm">Low Transaction Fees</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-800 font-medium text-sm">Lightning Fast Confirmations</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-800 font-medium text-sm">AI-Optimized Infrastructure</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-800 font-medium text-sm">Seamless DApp Integration</span>
            </div>
          </div>
        </CardContent>
        
        {/* Golden border glow */}
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/25"></div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {holderBenefits.map((benefit, index) => (
          <Card key={index} className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${benefit.color} bg-opacity-10`}>
                  <div className={benefit.color}>
                    {benefit.icon}
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl font-bold">
                {benefit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HolderBenefitsSection;
