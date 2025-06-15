
import { PublicKey, Transaction } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: PhantomWallet;
    phantom?: {
      solana?: PhantomWallet;
    };
  }
}

export interface PhantomWallet {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  connected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}
