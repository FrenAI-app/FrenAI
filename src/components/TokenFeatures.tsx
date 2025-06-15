
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Users, MessageCircle, Gift, Crown, Coins } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  available: boolean;
  actionText: string;
  onAction: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  price,
  available,
  actionText,
  onAction,
}) => {
  return (
    <Card className={`${available ? '' : 'opacity-75'} transition-all duration-300 hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <Badge variant={available ? "default" : "outline"} className="bg-amber-500">
            {price} cxFREN
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-amber-50 p-2 text-amber-800 text-sm">
          {available 
            ? 'You have enough tokens to unlock this feature!'
            : 'Earn more tokens to unlock this feature'
          }
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${available ? 'bg-amber-500 hover:bg-amber-600' : 'bg-muted'}`}
          disabled={!available}
          onClick={onAction}
        >
          {available ? actionText : <><Lock className="h-4 w-4 mr-2" /> Locked</>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export function TokenFeatures() {
  const dynamicContext = useDynamicContext();
  const { user, showAuthFlow } = dynamicContext;
  const isMobile = useIsMobile();
  
  // Mock fren balance - in a real app, you would fetch this from your backend
  const frenBalance = user ? 20 : null; 
  
  const features = [
    {
      title: 'Premium Chat',
      description: 'Unlock enhanced AI chat capabilities with expanded context and memory',
      icon: <MessageCircle className="h-5 w-5" />,
      price: 10,
      actionText: 'Activate Premium',
      onAction: () => console.log('Activate premium chat')
    },
    {
      title: 'Advanced Personalities',
      description: 'Access additional AI personalities and customize your experience',
      icon: <Star className="h-5 w-5" />,
      price: 15,
      actionText: 'Unlock Personalities',
      onAction: () => console.log('Unlock personalities')
    },
    {
      title: 'Group Chat',
      description: 'Create group chats with multiple AI personalities and friends',
      icon: <Users className="h-5 w-5" />,
      price: 25,
      actionText: 'Create Group',
      onAction: () => console.log('Create group chat')
    },
    {
      title: 'Virtual Gifts',
      description: 'Send virtual gifts during conversations to create memorable moments',
      icon: <Gift className="h-5 w-5" />,
      price: 5,
      actionText: 'Buy Gifts',
      onAction: () => console.log('Buy virtual gifts')
    },
    {
      title: 'DAO Membership',
      description: 'Join the HelloFrens DAO and vote on future features',
      icon: <Crown className="h-5 w-5" />,
      price: 50,
      actionText: 'Join DAO',
      onAction: () => console.log('Join DAO')
    }
  ];
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/7daa3721-33d2-4fcd-8494-3fd81ac2cc9c.png"
            alt="FREN Token"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Connect your wallet to access cxFREN token features and unlock premium capabilities
        </p>
        <Button 
          onClick={() => showAuthFlow()} 
          className="bg-amber-500 hover:bg-amber-600"
        >
          <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'px-4' : ''}`}>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/lovable-uploads/7daa3721-33d2-4fcd-8494-3fd81ac2cc9c.png"
            alt="FREN Token"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">cxFREN Token Features</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          Use your cxFREN tokens to unlock premium features and enhance your HelloFrens experience
        </p>
        <div className="bg-amber-50 px-4 py-2 rounded-full text-amber-800 font-medium flex items-center justify-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          Your Balance: {frenBalance !== null ? `${frenBalance.toFixed(2)} cxFREN` : 'Loading...'}
        </div>
      </div>

      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            price={feature.price}
            available={frenBalance !== null && frenBalance >= feature.price}
            actionText={feature.actionText}
            onAction={feature.onAction}
          />
        ))}
      </div>
      
      <Separator className="my-6" />
      
      <div className="bg-amber-50 rounded-lg p-6 mt-6">
        <h3 className="font-bold text-xl mb-4 text-amber-800">How to Earn cxFREN Tokens</h3>
        <ul className="space-y-3 text-amber-800">
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-amber-200 p-1 mt-1">
              <MessageCircle className="h-4 w-4 text-amber-700" />
            </div>
            <span>Daily active chat participation - earn 10 cxFREN for each consecutive day</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-amber-200 p-1 mt-1">
              <Users className="h-4 w-4 text-amber-700" />
            </div>
            <span>Invite friends - earn 50 cxFREN for each new user who joins</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-amber-200 p-1 mt-1">
              <Star className="h-4 w-4 text-amber-700" />
            </div>
            <span>Complete community challenges - earn up to 100 cxFREN per challenge</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TokenFeatures;
