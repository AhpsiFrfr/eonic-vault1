'use client';

import dynamic from 'next/dynamic';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const WalletProviderComponent = dynamic(
  () => import('./WalletProviderComponent').then(mod => mod.WalletProviderComponent),
  {
    ssr: false,
    loading: () => <div>Loading wallet...</div>
  }
);

export const ClientWalletProvider: FC<Props> = ({ children }) => {
  return <WalletProviderComponent>{children}</WalletProviderComponent>;

};
