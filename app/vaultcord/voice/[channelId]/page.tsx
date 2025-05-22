import { VoiceRoom } from '../../components/VoiceRoom';
import { useWallet } from '@solana/wallet-adapter-react';

export default function VoiceChannelPage({ params }: { params: { channelId: string } }) {
  return (
    <div className="flex-1 h-full">
      <VoiceRoom roomName={params.channelId} />
    </div>
  );
} 