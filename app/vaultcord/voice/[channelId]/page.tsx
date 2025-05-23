import React from 'react';
import { VoiceRoom } from '../../components/VoiceRoom';

interface Props {
  params: Promise<{ channelId: string }>;
}

export default async function VoiceChannelPage({ params }: Props) {
  const { channelId } = await params;
  return (
    <div className="flex-1 h-full">
      <VoiceRoom roomName={channelId} />
    </div>
  );
} 