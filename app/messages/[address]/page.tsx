import React from 'react';
import ClientMessagesPage from './ClientMessagesPage';

interface PageParams {
    address: string;
}

export default function DirectMessagesPage({ params }: { params: PageParams }) {
  return <ClientMessagesPage address={params.address} />;
}
