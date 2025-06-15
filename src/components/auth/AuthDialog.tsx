
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import PrivyWalletConnect from '../PrivyWalletConnect';
import { usePrivyAuth } from '@/context/PrivyContext';

interface AuthDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ children, open, onOpenChange }: AuthDialogProps) => {
  const { login } = usePrivyAuth();
  
  const handleLogin = () => {
    login();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to HelloFrens</DialogTitle>
          <DialogDescription>
            Sign in to save your chat history with your AI Fren.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect with Privy</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogin}
                className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center justify-center gap-2"
              >
                Open Privy Login
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Quickly connect with wallet, email, or social accounts
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Quick Connect</h3>
            <PrivyWalletConnect />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
