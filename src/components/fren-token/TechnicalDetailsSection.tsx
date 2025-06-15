
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, TrendingUp, Coins, CheckCircle } from 'lucide-react';
import ContractAddressBox from './ContractAddressBox';

const TechnicalDetailsSection = () => {
  // Updated contract address
  const contractAddress = "HeLp1ng0urFr3nds1nCryp7oW0rld123456789";

  const specifications = [
    { 
      label: "Blockchain", 
      value: "Solana", 
      icon: <Coins className="h-5 w-5" />,
      gradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500"
    },
    { 
      label: "Token Standard", 
      value: "SPL Token", 
      icon: <Shield className="h-5 w-5" />,
      gradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500"
    },
    { 
      label: "Total Supply", 
      value: "1,000,000,000 FREN", 
      icon: <TrendingUp className="h-5 w-5" />,
      gradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-500"
    },
    { 
      label: "Launch Platform", 
      value: "Pump.fun", 
      icon: <Users className="h-5 w-5" />,
      gradient: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-500"
    }
  ];

  const securityFeatures = [
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      title: "Fair Launch",
      description: "Impossible for developers to pre-mint and dump tokens"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      title: "Transparent Trading",
      description: "All transactions are transparent and recorded on chain"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      title: "Community Driven",
      description: "Pump.fun's bonding curve mechanism ensures sustainable price action based on genuine community demand"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text text-transparent">
          Technical Specifications
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Built on Solana for lightning-fast transactions and minimal fees
        </p>
      </div>

      {/* Contract Address */}
      <div className="mt-8">
        <ContractAddressBox contractAddress={contractAddress} />
      </div>

      {/* Minimalistic Technical Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {specifications.map((spec, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
            {/* Subtle gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${spec.gradient} opacity-60`}></div>
            
            <CardContent className="relative z-10 p-6 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 ${spec.iconBg} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {spec.icon}
                  </div>
                </div>
              </div>
              
              {/* Label */}
              <h3 className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">
                {spec.label}
              </h3>
              
              {/* Value */}
              <p className="text-lg font-semibold text-slate-800">
                {spec.value}
              </p>
            </CardContent>
            
            {/* Subtle border effect */}
            <div className="absolute inset-0 rounded-lg border border-slate-200/50 group-hover:border-slate-300/50 transition-colors duration-300"></div>
          </Card>
        ))}
      </div>

      {/* Security Features - Minimalistic Design */}
      <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mt-12">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-slate-800 text-xl md:text-2xl font-semibold">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            Security & Trust Features
          </CardTitle>
          <CardDescription className="text-slate-600 text-base md:text-lg">
            FREN token incorporates multiple security measures to protect investors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="group p-5 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-2 text-base group-hover:text-emerald-700 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalDetailsSection;
