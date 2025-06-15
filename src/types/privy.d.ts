
declare module '@privy-io/react-auth' {
  import { ReactNode } from 'react';

  interface LinkedAccount {
    type: 'email' | 'wallet' | 'passkey' | 'smart_wallet' | 'phone' | 
           'google_oauth' | 'twitter_oauth' | 'discord_oauth' | 'github_oauth' | 
           'spotify_oauth' | 'instagram_oauth' | 'tiktok_oauth' | 'facebook_oauth' | 
           'twitch_oauth' | 'apple_oauth' | 'linkedin_oauth' | 'cross_app';
    address?: string;
    chain?: string;
    chainId?: number;
    verifiedAt?: string;
    detail?: {
      email?: string;
      name?: string;
      picture?: string;
    };
  }

  interface PrivyUser {
    id: string;
    email?: string | null;
    phone?: string | null;
    linkedAccounts?: LinkedAccount[];
    created?: string;
    updated?: string;
  }

  interface PrivyContext {
    user: PrivyUser | null;
    authenticated: boolean;
    ready: boolean;
    login: () => void;
    logout: () => void;
    createWallet: () => Promise<any>;
    linkWallet: () => Promise<any>;
    unlinkWallet: (address: string) => Promise<void>;
    linkEmail: (email: string) => Promise<any>;
    unlinkEmail: (email: string) => Promise<void>;
    exportWallet: (address: string) => Promise<string>;
    connectWallet: () => Promise<any>;
  }

  interface PrivyProviderProps {
    appId: string;
    onSuccess?: (user: PrivyUser, isNewUser: boolean) => void;
    onError?: (error: Error) => void;
    loginMethods?: string[];
    appearance?: {
      theme?: 'light' | 'dark';
      accentColor?: string;
      logo?: string;
      showWalletLoginFirst?: boolean;
    };
    children?: ReactNode;
  }

  export function PrivyProvider(props: PrivyProviderProps): JSX.Element;
  export function usePrivy(): PrivyContext;
}
