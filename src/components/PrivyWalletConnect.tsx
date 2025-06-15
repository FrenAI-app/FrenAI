
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePrivyAuth } from '@/context/PrivyContext';
import { LogIn, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const PrivyWalletConnect = () => {
  const { 
    user, 
    authenticated, 
    login, 
    logout,
    ready 
  } = usePrivyAuth();
  
  const { profile } = useUser();
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  // Function to get user image
  const getUserImage = () => {
    // First try profile avatar
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
    // Then try Privy linked accounts
    if (user?.linkedAccounts) {
      for (const account of user.linkedAccounts) {
        if (account.type === 'google_oauth' && account.detail?.picture) {
          return account.detail.picture;
        }
      }
    }
    
    return null;
  };
  
  // Function to get user display name
  const getUserDisplayName = () => {
    if (profile?.username) {
      return profile.username;
    }
    
    if (user?.email) {
      return String(user.email).split('@')[0];
    }
    
    if (user?.linkedAccounts) {
      for (const account of user.linkedAccounts) {
        if (account.type === 'google_oauth' && account.detail?.name) {
          return account.detail.name;
        }
      }
    }
    
    return 'User';
  };
  
  // Get wallet address if available
  const getWalletAddress = () => {
    if (profile?.wallet_address) {
      return profile.wallet_address;
    }
    
    if (!user || !user.linkedAccounts) return '';
    
    for (const account of user.linkedAccounts) {
      if (account.type === 'wallet') {
        return account.address;
      }
    }
    
    return '';
  };
  
  // Show loading state if Privy is not ready
  if (!ready) {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  const userImage = getUserImage();
  const displayName = getUserDisplayName();
  const walletAddress = getWalletAddress();

  return (
    <div>
      {authenticated && user ? (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border border-green-200 hover:border-green-300 transition-all">
                <AvatarImage 
                  src={userImage || ''} 
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                  {displayName[0]?.toUpperCase() || <User className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{displayName}</p>
            </TooltipContent>
          </Tooltip>
          
          {walletAddress && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {formatAddress(walletAddress)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{walletAddress}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="h-3 w-3 mr-1" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => login()}
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white border-green-500"
        >
          <LogIn className="h-3 w-3" />
          <span>Sign In</span>
        </Button>
      )}
    </div>
  );
};

export default PrivyWalletConnect;
