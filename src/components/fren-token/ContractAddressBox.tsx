
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ContractAddressBoxProps {
  contractAddress: string;
  className?: string;
}

const ContractAddressBox: React.FC<ContractAddressBoxProps> = ({ 
  contractAddress, 
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`bg-white/30 rounded-lg p-3 border border-white/40 ${className}`}>
      <p className="text-xs text-amber-700 mb-2 font-medium">Contract Address:</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs bg-black/20 text-amber-900 p-2 rounded font-mono break-all">
          {contractAddress}
        </code>
        <Button
          onClick={copyContractAddress}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white p-2 h-8 w-8"
          title="Copy contract address"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-green-700 mt-1">Copied to clipboard!</p>
      )}
    </div>
  );
};

export default ContractAddressBox;
