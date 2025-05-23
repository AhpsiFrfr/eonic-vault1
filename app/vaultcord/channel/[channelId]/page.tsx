import React from 'react';
import { MessagePanel } from '../../components/MessagePanel';

interface Props {
  params: Promise<{ channelId: string }>;
}

export default async function VaultcordChannelPage({ params }: Props) {
  const { channelId } = await params;
  return (
    <div className="flex-1 h-full">
      <MessagePanel channelId={channelId} />
    </div>
  );
} 