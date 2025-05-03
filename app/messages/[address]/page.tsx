'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Chat from '../../../components/Chat';
import { supabase } from '../../../utils/supabase';

interface DirectMessagesPageProps {
  params: {
    address: string;
  };
}

export default function DirectMessagesPage({ params }: DirectMessagesPageProps) {
  const { address } = params;
  const { publicKey } = useWallet();
  
  if (!publicKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Please connect your wallet to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-indigo-400">
          Chat with {address.slice(0, 8)}...
        </h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <Chat 
          room={`dm:${[publicKey.toString(), address].sort().join(':')}`}
          isDM={true}
          recipientAddress={address}
        />
      </div>
    </div>
  );
}
