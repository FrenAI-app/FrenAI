
declare module '@dynamic-labs/sdk-react-core' {
  interface VerifiedCredential {
    address: string;
    walletName?: string;
    chain?: string;
    chainId?: number;
    id?: string;
  }
  
  interface UserProfile {
    id: string;
    email?: string;
    verifiedCredentials?: VerifiedCredential[];
    username?: string;
    alias?: string;
    firstName?: string;
    lastName?: string;
  }
  
  interface DynamicContext {
    user: UserProfile | null;
    handleLogOut: () => void;
    showAuthFlow: () => void;
    isAuthenticated: boolean;
    primaryWallet?: any;
  }
  
  export function useDynamicContext(): DynamicContext;
  
  interface DynamicContextProviderProps {
    children: React.ReactNode;
    settings: {
      environmentId: string;
      walletConnectors: any[];
      events?: {
        onAuthSuccess?: () => void;
        onLogout?: () => void;
      };
    };
  }
  
  export function DynamicContextProvider(props: DynamicContextProviderProps): JSX.Element;
}

declare module '@dynamic-labs/ethereum' {
  const EthereumWalletConnectors: any;
  export { EthereumWalletConnectors };
}

declare module '@dynamic-labs/solana' {
  const SolanaWalletConnectors: any;
  export { SolanaWalletConnectors };
}
