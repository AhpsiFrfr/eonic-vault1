import { MessagePanel } from '../../components/MessagePanel';

export default function ChannelPage({ params }: { params: { channelId: string } }) {
  return (
    <div className="flex-1 h-full">
      <MessagePanel channelId={params.channelId} />
    </div>
  );
} 