import React from 'react';
import { Metadata } from 'next';
import ClientMessagesPage from './ClientMessagesPage';

export const metadata: Metadata = {
  title: 'Messages - EONIC',
  description: 'Direct messaging interface for EONIC',
};

interface Props {
  params: {
    address: string;
  };
}

const DirectMessagesPage = ({ params }: Props) => {
  return <ClientMessagesPage address={params.address} />;
};

export default DirectMessagesPage;
