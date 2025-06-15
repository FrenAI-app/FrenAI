
import { Connection, PublicKey, clusterApiUrl, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from '@/components/ui/use-toast';
import { PhantomWallet } from '@/types/phantom';

// Token Constants
export const FREN_TOKEN_MINT_ADDRESS = 'YOUR_TOKEN_MINT_ADDRESS'; // Replace once token is created
export const FREN_TOKEN_DECIMALS = 9; // Standard for most SPL tokens

// Solana Connection
export const getConnection = () => {
  // Use devnet for development, change to mainnet-beta for production
  return new Connection(clusterApiUrl('devnet'), 'confirmed');
};

// Wallet Interface
export type WalletAdapter = {
  publicKey: PublicKey | null;
  connected: boolean;
  connect: () => Promise<any>; // Making this more flexible to accommodate both return types
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
};

// Get Phantom Wallet
export const getPhantomWallet = (): WalletAdapter | null => {
  if (typeof window !== 'undefined') {
    // Check for Phantom in modern structure (window.phantom.solana)
    if (window.phantom?.solana?.isPhantom) {
      return window.phantom.solana as unknown as WalletAdapter;
    }
    // Also check legacy location (window.solana)
    if (window.solana?.isPhantom) {
      return window.solana as unknown as WalletAdapter;
    }
  }
  return null;
};

// Connect to wallet
export const connectWallet = async (): Promise<WalletAdapter | null> => {
  try {
    const wallet = getPhantomWallet();
    if (!wallet) {
      toast({
        title: "Wallet not found",
        description: "Please install Phantom wallet to use FREN token features",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return null;
    }
    
    await wallet.connect();
    return wallet;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    toast({
      title: "Connection Failed",
      description: "Failed to connect to Solana wallet",
      variant: "destructive",
    });
    return null;
  }
};

// Get FREN token balance
export const getFrenTokenBalance = async (wallet: WalletAdapter): Promise<number | null> => {
  try {
    if (!wallet.publicKey) return null;
    
    const connection = getConnection();
    const tokenMint = new PublicKey(FREN_TOKEN_MINT_ADDRESS);
    
    // Find the associated token account
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      wallet.publicKey,
      { mint: tokenMint }
    );
    
    // If no token account found, balance is 0
    if (tokenAccounts.value.length === 0) return 0;
    
    // Get token account info and parse balance
    const accountInfo = await connection.getTokenAccountBalance(
      tokenAccounts.value[0].pubkey
    );
    
    return parseFloat(accountInfo.value.uiAmountString || '0');
  } catch (error) {
    console.error('Error fetching FREN balance:', error);
    return null;
  }
};
