
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';

const DevelopmentNotice: React.FC = React.memo(() => {
  return (
    <Card className="enhanced-glass-card border-orange-200/50 bg-gradient-to-br from-orange-50/40 to-amber-50/40 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="bg-orange-100/80 text-orange-700 border-orange-200/50">
            <Code className="h-3 w-3 mr-1" />
            Preview Mode
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent mb-1">
              Under Development
            </CardTitle>
            <CardDescription className="text-orange-700/70 text-sm">
              The on-chain voting system is currently being developed
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-orange-700/80 text-sm leading-relaxed">
          Preview the governance interface below. Voting functionality will be enabled once the smart contracts are deployed.
        </p>
      </CardContent>
    </Card>
  );
});

DevelopmentNotice.displayName = 'DevelopmentNotice';

export default DevelopmentNotice;
