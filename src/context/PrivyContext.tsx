
import React, { createContext, useContext, ReactNode } from 'react';
import { PrivyProvider as PrivyClientProvider, usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

// Use the provided Privy App ID
const PRIVY_APP_ID = 'cmazaefb4003xld0n8shpt3xd';

// Create a context with default values to prevent undefined errors
type PrivyContextType = ReturnType<typeof usePrivy> & {
  // Add any additional properties here
};

// Create an initial empty context
const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

export const usePrivyAuth = (): PrivyContextType => {
  const context = useContext(PrivyContext);
  if (!context) {
    console.error('usePrivyAuth must be used within a PrivyProvider');
    throw new Error('usePrivyAuth must be used within a PrivyProvider');
  }
  return context;
};

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  // Handle auth state changes
  const handleSuccess = async (user: any, isNewUser: boolean) => {
    try {
      // If we have a user, sync with Supabase
      if (user && user.id) {
        console.log('Privy auth success:', user.id);
        
        // Get wallet address if available
        let walletAddress = '';
        const linked = user.linkedAccounts || [];
        for (const account of linked) {
          if (account.type === 'wallet') {
            walletAddress = account.address;
            break;
          }
        }
        
        // Custom event to trigger profile refresh
        window.dispatchEvent(new Event('PROFILE_UPDATED'));
        
        if (isNewUser) {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Error in Privy onSuccess handler:', error);
    }
  };

  return (
    <PrivyClientProvider
      appId={PRIVY_APP_ID}
      loginMethods={['email', 'wallet', 'google']}
      appearance={{
        theme: 'light' as 'light',
        accentColor: '#10b981',
        logo: '/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png',
        showWalletLoginFirst: true,
      }}
      onSuccess={handleSuccess}
    >
      <PrivyContextConsumer>{children}</PrivyContextConsumer>
    </PrivyClientProvider>
  );
};

// This component consumes the Privy context and makes it available via our custom context
const PrivyContextConsumer = ({ children }: { children: ReactNode }) => {
  const privyContext = usePrivy();
  
  return (
    <PrivyContext.Provider value={privyContext}>
      {children}
    </PrivyContext.Provider>
  );
};

export default PrivyProvider;
