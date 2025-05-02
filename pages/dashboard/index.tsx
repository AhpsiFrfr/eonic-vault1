'use client';
import { EonicDashboard } from '../../components/EonicDashboard';

export default function DashboardPage() {
  return <EonicDashboard />;
}

const ALL_BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', lore: 'You were here from the beginning.' },
  { id: 'ghost_in_the_shell', name: 'Ghost in the Shell', lore: 'Mastered the art of digital presence.' },
  { id: 'hidden_key', name: 'The Hidden Key', lore: 'You found what wasn\'t meant to be found.' },
  { id: 'first_referral', name: 'First Referral', lore: 'You called another into the dark.' },
  { id: 'dimensional_echo', name: 'Dimensional Echo', lore: 'Your voice was heard across timelines.' },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Badge {
  id: string;
  name: string;
  lore: string;
}

interface Profile {
  name: string;
  status: string;
  wallet_address: string;
}

const EonicDashboard = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Community');
  const [messages, setMessages] = useState<string[]>(['Welcome to the Eonic Vault.']);
  const [input, setInput] = useState('');
  const [profileName, setProfileName] = useState('');
  const [status, setStatus] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Badge | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>(['early_adopter', 'ghost_in_the_shell']);

  useEffect(() => {
    if (!connected && publicKey === null) {
      router.replace('/');
    }
  }, [connected, publicKey, router]);

  const loadProfile = async () => {
    if (!publicKey) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (error) throw error;
      if (data) {
        setProfileName(data.name || '');
        setStatus(data.status || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      toast.error('Failed to load profile');
    }
  };

  const handleSaveProfile = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        wallet_address: publicKey.toString(),
        name: profileName,
        status: status,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success('Profile saved successfully!');
      setShowProfile(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!connected || !publicKey) {
      router.replace('/');
      return;
    }

    const loadProfile = async () => {
      if (!publicKey) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, status')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (error) throw error;
        if (data) {
          setProfileName(data.name);
          setStatus(data.status);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      }
    };

    loadProfile();
  }, [connected, publicKey, router]);

  const handleSaveProfile = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        wallet_address: publicKey.toString(),
        name: profileName,
        status,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      setShowProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !publicKey) return;
    loadProfile();
  }, [connected, publicKey, router]);

  const loadProfile = async () => {
    if (!publicKey) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, status')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (error) throw error;
      if (data) {
        setProfileName(data.name);
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white font-sans p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Eonic Vault</h1>
        <button
          onClick={() => setShowProfile(true)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Profile
        </button>
      </div>

      <div className="flex space-x-4 mb-8">
        {['Community', 'NFTs', 'Cabal', 'Achievements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'Community' && (
          <Chat
            messages={messages}
            input={input}
            setInput={setInput}
            setMessages={setMessages}
            publicKey={publicKey}
          />
        )}
        {activeTab === 'NFTs' && <NFTGallery publicKey={publicKey} />}
        {activeTab === 'Cabal' && <Cabal publicKey={publicKey} />}
        {activeTab === 'Achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlocked.map((badge) => (
              <div
                key={badge}
                className={`p-4 rounded-lg ${selected?.id === badge ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setSelected({ id: badge, name: badge, lore: 'Achievement unlocked!' })}
              >
                <h3 className="text-xl font-semibold mb-2">{badge}</h3>
                {selected?.id === badge && (
                  <p className="text-gray-300">{selected.lore}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  export default EonicDashboard;
        room: 'general'
      });

      if (error) {
        toast.error('Failed to send message');
        return;
      }

      setMessages([...messages, input]);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  const handleSaveProfile = async () => {
    if (!publicKey) return;

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error } = await supabase
        .from('profiles')
        .upsert({
          wallet_address: publicKey.toString(),
          name: profileName,
          status
        });

      if (error) {
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile updated successfully');
      setShowProfile(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white font-sans p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded-lg text-white font-semibold shadow-md hover:scale-105 transition-transform"
          onClick={() => setShowProfile(true)}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex gap-6 border-b border-gray-800 pb-2">
        {['NFTs', 'Community', 'Cabal', 'Achievements'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
              tab === activeTab ? 'text-[#00d8ff] border-b-2 border-[#00d8ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="bg-[#1E1E2A] rounded-xl p-6 min-h-[400px] shadow-[0_0_10px_rgba(0,216,255,0.2)]">
        {activeTab === 'NFTs' && (
          <div className="text-center space-y-4">
            <h2 className="text-xl text-[#00d8ff]">Timepiece Evolution</h2>
            <div className="w-40 h-40 mx-auto bg-[#2A2A3A] rounded-full flex items-center justify-center text-xl shadow-inner">
              Stage 2
            </div>
            <p className="text-gray-400 text-sm">Your Timepiece has evolved based on referral activity.</p>
          </div>
        )}

        {activeTab === 'Community' && (
          <div className="flex flex-col h-full justify-between">
            <div className="overflow-y-auto max-h-[300px] mb-4 pr-2 space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="bg-[#2A2A3A] p-2 rounded-md text-sm">
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 bg-[#1E1E2A] text-white border border-[#444] rounded-l-lg focus:outline-none focus:border-[#00d8ff]"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] text-white font-bold rounded-r-lg shadow-md hover:scale-105 transition-transform"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Cabal' && (
          <div>
            <h2 className="text-[#00d8ff] text-lg font-semibold mb-2">Coming Soon</h2>
            <p>The EONIC NFT collection will be launching on June 1st, 2025. Stay tuned!</p>
          </div>
        )}

        {activeTab === 'Achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {ALL_BADGES.map(badge => {
              const unlockedBadge = unlocked.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  onClick={() => unlockedBadge && setSelected(badge)}
                  className={`flex flex-col items-center text-center p-4 rounded-lg cursor-pointer border transition duration-200 ${
                    unlockedBadge
                      ? 'bg-[#1E1E2A] border-[#00d8ff] shadow-[0_0_8px_rgba(0,216,255,0.4)] hover:scale-105'
                      : 'bg-[#13131A] border-gray-700 opacity-40'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#2A2A3A] mb-2 flex items-center justify-center">
                    {unlockedBadge ? '🌟' : '🔒'}
                  </div>
                  <span className="text-sm font-medium">{badge.name}</span>
                  {unlockedBadge && <p className="text-xs text-gray-400 mt-1">{badge.lore}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] text-white p-6 rounded-xl max-w-md w-full text-center border border-[#00d8ff] shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-gray-300 mb-4 italic">{selected.lore}</p>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] rounded-xl p-6 w-full max-w-md text-white shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              className="w-full mb-3 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
              placeholder="Display Name"
            />
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full mb-6 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <div className="flex justify-end gap-3">
              <button 
                className="text-gray-400 hover:text-white" 
                onClick={() => setShowProfile(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] text-white p-6 rounded-xl max-w-md w-full text-center border border-[#00d8ff] shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-gray-300 mb-4 italic">{selected.lore}</p>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] rounded-xl p-6 w-full max-w-md text-white shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              className="w-full mb-3 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
              placeholder="Display Name"
            />
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full mb-6 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <div className="flex justify-end gap-3">
              <button className="text-gray-400 hover:text-white" onClick={() => setShowProfile(false)}>
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Community');
  const [messages, setMessages] = React.useState(['Welcome to the Eonic Vault.']);
  const [input, setInput] = React.useState('');
  const [showProfile, setShowProfile] = React.useState(false);
  const [profileName, setProfileName] = React.useState('VaultUser01');
  const [status, setStatus] = React.useState('online');
  const [unlocked, setUnlocked] = React.useState(['early_adopter', 'ghost_in_the_shell']);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    if (!connected && publicKey === null) {
      router.replace('/');
    }
  }, [connected, publicKey, router]);
          setProfileName(data.display_name || publicKey.toString().slice(0, 8));
          setStatus(data.status || 'online');
        } else {
          setProfileName(publicKey.toString().slice(0, 8));
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setProfileName(publicKey.toString().slice(0, 8));
      }
    };

    loadProfile();
  }, [publicKey]);

  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F] text-gray-200">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!connected) {
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const handleSaveProfile = async () => {
    if (!publicKey) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_address: publicKey.toString(),
          display_name: profileName,
          status: status,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setShowProfile(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const getTabContent = (tab: string) => {
    const normalizedTab = tab.toLowerCase();
    switch (normalizedTab) {
      case 'nfts':
        return <NFTGallery />;
      case 'community':
        return (
          <div className="h-[600px]">
            <Chat 
              walletAddress={publicKey?.toString() || ''}
              room="general"
            />
          </div>
        );
      case 'cabal':
        return (
          <div>
            <h2 className="text-[#00d8ff] text-lg font-semibold mb-2">Coming Soon</h2>
            <p>The EONIC NFT collection will be launching on June 1st, 2025. Stay tuned!</p>
          </div>
        );
      case 'achievements':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {ALL_BADGES.map((badge) => {
              const unlockedBadge = unlocked.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  onClick={() => unlockedBadge && setSelected(badge)}
                  className={`flex flex-col items-center text-center p-4 rounded-lg cursor-pointer border transition duration-200 ${
                    unlockedBadge
                      ? 'bg-[#1E1E2A] border-[#00d8ff] shadow-[0_0_8px_rgba(0,216,255,0.4)] hover:scale-105'
                      : 'bg-[#13131A] border-gray-700 opacity-40'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#2A2A3A] mb-2 flex items-center justify-center">🛡️</div>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white font-sans p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded-lg text-white font-semibold shadow-md hover:scale-105 transition-transform"
          onClick={() => setShowProfile(true)}
        >
          Edit Profile
        </button>
      </div>

      <div className="flex gap-6 border-b border-gray-800 pb-2">
        {['NFTs', 'Community', 'Cabal', 'Achievements'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium transition-all duration-200 ${
              tab === activeTab ? 'text-[#00d8ff] border-b-2 border-[#00d8ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="bg-[#1E1E2A] rounded-xl p-6 min-h-[400px] shadow-[0_0_10px_rgba(0,216,255,0.2)]">
        {getTabContent(activeTab)}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] text-white p-6 rounded-xl max-w-md w-full text-center border border-[#00d8ff] shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-gray-300 mb-4 italic">{selected.lore}</p>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] rounded-xl p-6 w-full max-w-md text-white shadow-[0_0_10px_rgba(0,216,255,0.3)]">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full mb-3 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
              placeholder="Display Name"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mb-6 p-2 bg-[#2A2A3A] border border-[#444] rounded text-white"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <div className="flex justify-end gap-3">
              <button 
                className="text-gray-400 hover:text-white" 
                onClick={() => setShowProfile(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-gradient-to-r from-[#00d8ff] to-[#8a2be2] rounded text-white shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
