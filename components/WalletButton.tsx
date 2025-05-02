import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

export const WalletButton: FC = () => {
  const { wallet } = useWallet();

  return (
    <div className="fixed top-4 right-4">
      <WalletMultiButton className="!bg-gradient-to-r from-cyan-500 to-blue-500 !rounded-lg" />
    </div>
  );
};
