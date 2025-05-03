import { supabase } from './supabase';

export const updatePresence = async (roomId: string, walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('online_users')
      .upsert(
        {
          wallet_address: walletAddress,
          room_id: roomId,
          username: walletAddress.slice(0, 8) + '...',
          last_seen: new Date().toISOString(),
        },
        { onConflict: 'wallet_address,room_id' }
      );

    if (error) {
      console.error('Error updating presence:', error);
    }

    return data;
  } catch (error) {
    console.error('Error in updatePresence:', error);
    return null;
  }
};

export const startPresenceHeartbeat = (roomId: string, walletAddress: string) => {
  // Update presence immediately
  updatePresence(roomId, walletAddress);

  // Then update every minute
  const intervalId = setInterval(() => {
    updatePresence(roomId, walletAddress);
  }, 60 * 1000);

  return () => clearInterval(intervalId);
};
