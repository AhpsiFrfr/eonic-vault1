import React from 'react';
import { Metadata } from 'next';
import ClientMessagesPage from './ClientMessagesPage';

export const metadata: Metadata = {
  title: 'Messages - EONIC',
  description: 'Direct messaging interface for EONIC',
};

interface Props {
  params: Promise<{
    address: string;
  }>;
}

const DirectMessagesPage = async ({ params }: Props) => {
  const { address } = await params;
  return <ClientMessagesPage address={address} />;
};

export default DirectMessagesPage;
