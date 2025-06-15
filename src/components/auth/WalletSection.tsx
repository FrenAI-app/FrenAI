
import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface WalletSectionProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const WalletSection = ({ onConnect, onDisconnect }: WalletSectionProps) => {
  const { connectToWallet, disconnectWallet, connected, publicKey, frenBalance } = useWallet();
  
  const handleConnect = () => {
    connectToWallet();
    if (onConnect) onConnect();
  };
  
  const handleDisconnect = () => {
    disconnectWallet();
    if (onDisconnect) onDisconnect();
  };
  
  const formatPublicKey = (key: string): string => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  // Display a warning about this component being deprecated
  console.warn('WalletSection component is deprecated - please migrate to DynamicWalletConnect');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h3 className="text-sm font-medium">Connect Your Wallet</h3>
        <Separator className="flex-1 mx-2" />
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {connected ? (
        <div className="bg-muted p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="text-xs text-muted-foreground">{formatPublicKey(publicKey?.toString() || '')}</p>
              {frenBalance !== null && (
                <p className="text-xs font-medium text-amber-600">{frenBalance.toFixed(2)} FREN</p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={handleConnect} 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
          size="sm"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Phantom Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletSection;
