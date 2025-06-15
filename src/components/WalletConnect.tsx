
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWallet } from '@/context/WalletContext';
import { Wallet } from 'lucide-react';

const WalletConnect = () => {
  const { connectToWallet, disconnectWallet, connected, publicKey } = useWallet();
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {connected && publicKey ? (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {formatAddress(publicKey.toString())}
          </span>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectToWallet} 
          variant="outline" 
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
