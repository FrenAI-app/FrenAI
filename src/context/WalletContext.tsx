
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface WalletContextType {
  connectToWallet: () => void;
  disconnectWallet: () => void;
  connected: boolean;
  publicKey: { toString: () => string } | null;
  frenBalance: number | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<{ toString: () => string } | null>(null);
  
  console.warn('WalletProvider is deprecated - please use DynamicContext instead');
  
  const connectToWallet = () => {
    console.warn('connectToWallet is deprecated - please use DynamicContext instead');
    setConnected(true);
    setPublicKey({ toString: () => "0x0000000000000000" });
  };
  
  const disconnectWallet = () => {
    console.warn('disconnectWallet is deprecated - please use DynamicContext instead');
    setConnected(false);
    setPublicKey(null);
  };
  
  return (
    <WalletContext.Provider 
      value={{ 
        connectToWallet, 
        disconnectWallet, 
        connected, 
        publicKey, 
        frenBalance: connected ? 10 : null 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    console.warn('useWallet must be used within a WalletProvider - consider migrating to DynamicContext');
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};
