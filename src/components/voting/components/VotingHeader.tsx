
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface VotingHeaderProps {
  userTokenBalance: number;
}

const VotingHeader: React.FC<VotingHeaderProps> = React.memo(({ userTokenBalance }) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-6">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-800 mb-2`}>
        FREN Governance
      </h1>
      <p className={`${isMobile ? 'text-sm' : 'text-base'} text-purple-600 mb-4`}>
        Shape the future of FrenAI through community voting
      </p>
      
      <Card className="enhanced-glass-card border-green-200/50 bg-gradient-to-r from-green-50/30 to-emerald-50/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="relative">
                <p className="text-2xl font-bold text-green-800 filter blur-sm select-none">
                  {userTokenBalance.toLocaleString()} FREN
                </p>
              </div>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

VotingHeader.displayName = 'VotingHeader';

export default VotingHeader;
