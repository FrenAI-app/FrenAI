import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Users, Shield, Globe, Building, AlertTriangle } from 'lucide-react';

const CommunitySection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold">
          Building Our Community
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The strength of FREN lies in its community. Together, we're creating something revolutionary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-700">
              <Megaphone className="h-6 w-6" />
              Why Independent Channels Matter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-800 leading-relaxed">
              <strong>True decentralization requires community ownership of communication.</strong> While we provide initial platforms, the FREN community must establish independent channels to ensure:
            </p>
            <ul className="space-y-2 text-red-700">
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 mt-0.5 shrink-0" />
                <span><strong>Censorship resistance</strong> - No single entity can silence the community</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 mt-0.5 shrink-0" />
                <span><strong>Community sovereignty</strong> - Members control their own spaces and rules</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-5 w-5 mt-0.5 shrink-0" />
                <span><strong>Global resilience</strong> - Multiple channels ensure continuous communication</span>
              </li>
              <li className="flex items-start gap-2">
                <Building className="h-5 w-5 mt-0.5 shrink-0" />
                <span><strong>Organic growth</strong> - Community-led expansion creates authentic engagement</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-700">
              <Users className="h-6 w-6" />
              Community Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-800 leading-relaxed">
              <strong>Every FREN holder plays a crucial role</strong> in building our decentralized community infrastructure:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🚀 Launch Independent Servers</h4>
                <p className="text-sm text-green-700">Create Discord servers, Telegram groups, and other platforms managed by community members</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🗳️ Establish Governance</h4>
                <p className="text-sm text-green-700">Implement community voting systems and transparent decision-making processes</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🤝 Spread the Word</h4>
                <p className="text-sm text-green-700">Share FREN with your friends, spread awareness, and introduce new members to our amazing project!</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📢 Content Creation</h4>
                <p className="text-sm text-green-700">Develop educational content, tutorials, and community-driven resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Important Disclaimer
            </h3>
          </div>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              <strong>Risk Warning:</strong> FREN token is a meme coin with utility that carries inherent risks. The value of tokens may fluctuate significantly and you may lose some or all of your investment. Past performance is not indicative of future results.
            </p>
            <p>
              <strong>No Financial Advice:</strong> Information provided on this platform is for educational and informational purposes only and should not be construed as financial, investment, or legal advice. Always conduct your own research and consult with qualified professionals before making investment decisions.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> HelloFrens, its developers, and associated parties disclaim all responsibility for any financial losses, damages, or adverse consequences arising from the purchase, holding, trading, or use of FREN tokens. Participation is entirely at your own risk.
            </p>
            <p>
              <strong>Regulatory Compliance:</strong> It is your responsibility to ensure compliance with applicable laws and regulations in your jurisdiction. Token availability and features may vary by location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
