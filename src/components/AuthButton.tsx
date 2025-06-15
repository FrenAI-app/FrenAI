
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from 'lucide-react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { toast } from '@/components/ui/use-toast';

const AuthButton = () => {
  const { login, logout, authenticated, user } = usePrivyAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      
      toast({
        title: "Signed out",
        description: "You have successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {authenticated && user ? (
        <div className="flex items-center gap-1">
          {user.email && (
            <span className="text-xs text-muted-foreground hidden md:block truncate max-w-16">
              {String(user.email)}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            className="h-6 px-1.5 text-xs touch-manipulation"
          >
            <LogOut className="h-3 w-3 mr-0.5" />
            <span className="text-xs">Sign Out</span>
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => login()} 
            className="h-6 px-2 text-xs touch-manipulation relative z-10 bg-white/20 border-white/15"
          >
            <LogIn className="h-3 w-3 mr-0.5" />
            <span className="text-xs">Sign In</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default AuthButton;
