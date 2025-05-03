import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

export const WalletButton: FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet } = useWallet();

  return (
    <WalletMultiButton 
      className={`!bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-lg ${className}`}
    />
  );
};
