import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createSupabaseClient } from '../utils/supabase';
import { FaGithub, FaGlobe, FaTwitter, FaDiscord } from 'react-icons/fa';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { 
  MockProfile, 
  getMockProfile, 
  saveMockProfile, 
  createDefaultProfile 
} from '../utils/mock-data';
import { Dialog } from './ui/dialog';
import EonIDPreview from './ui/EonIDPreview';
import { Loader } from './ui/loader';

// Card style options for business cards
const CARD_STYLES = [
  { label: 'Intern', value: 'intern' },
  { label: 'Secretary', value: 'secretary' },
  { label: 'Management', value: 'management' },
  { label: 'CEO', value: 'ceo' },
  { label: 'Paul Allen', value: 'paul_allen' }
];

interface EonIdProps {
  userWalletAddress: string;
}

export function EonId({ userWalletAddress }: EonIdProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [showCardSettings, setShowCardSettings] = useState(false);
  
  const [formData, setFormData] = useState<MockProfile>({
    id: '',
    wallet_address: userWalletAddress,
    display_name: '',
    title: '',
    bio: '',
    avatar_url: '',
    use_shortened_wallet: false,
    tagline: '',
    domain: '',
    show_real_name: false,
    allow_non_mutual_dms: true,
    show_holdings: true,
    is_public: false,
    social_links: {},
    card_style: 'intern',
    show_business_card: false
  });

  // Use Supabase in production, fallback to mock data in development
  const supabase = createSupabaseClient(userWalletAddress);

  useEffect(() => {
    loadEonIdData();
  }, [userWalletAddress]);

  const loadEonIdData = async () => {
    try {
      // Check if we already have mock data for this wallet
      const existingProfile = getMockProfile(userWalletAddress);
      if (existingProfile) {
        console.log('[MOCK] Using cached profile data for', userWalletAddress.substring(0, 8) + '...');
        setFormData(existingProfile);
        if (existingProfile.avatar_url) {
          setAvatarPreview(existingProfile.avatar_url);
        }
        setIsLoading(false);
        return;
      }

      // Try to load from Supabase
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('wallet_address', userWalletAddress)
          .single();

        if (error) throw error;

        if (data) {
          const profile: MockProfile = {
            ...data,
            social_links: data.social_links || {}
          };
          setFormData(profile);
          if (data.avatar_url) {
            setAvatarPreview(data.avatar_url);
          }
          // Cache it in our mock storage
          saveMockProfile(profile);
        } else {
          // Create mock data if nothing found
          createMockProfile();
        }
      } catch (supabaseError) {
        console.log('[MOCK] Failed to load from Supabase, using mock data');
        createMockProfile();
      }
    } catch (error) {
      console.error('Error loading EON-ID data:', error);
      createMockProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const createMockProfile = () => {
    // Create a default profile for development
    const mockProfile = createDefaultProfile(userWalletAddress);
    
    // Update state
    setFormData(mockProfile);
    setAvatarPreview(mockProfile.avatar_url);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl);
        
        // Immediately update form data with the new avatar preview
        // This ensures it's available when saving even if upload fails
        setFormData(prev => ({
          ...prev,
          avatar_url: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Start with current avatar URL from form data
      let avatarUrl = formData.avatar_url;
      
      // Only try to upload if we have a file and are not using a data URL
      if (avatarFile && !avatarUrl.startsWith('data:')) {
        try {
          const fileName = `${userWalletAddress}/${Date.now()}-${avatarFile.name}`;
          const { error: uploadError, data } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          avatarUrl = publicUrl;
        } catch (uploadError) {
          console.log('[MOCK] Upload failed, using avatar preview URL');
          // In mock mode, we're already using the data URL from avatar preview
          // which was set in handleAvatarChange
        }
      }

      console.log('[MOCK] Saving profile with avatar URL:', avatarUrl);
      console.log('[MOCK] Bio content being saved:', formData.bio);

      // Create updated profile with the avatar URL
      const updatedProfile: MockProfile = {
        ...formData,
        avatar_url: avatarUrl,
        bio: formData.bio || '', // Explicitly ensure bio is included
        updated_at: new Date().toISOString()
      };

      try {
        // Try to update in Supabase
        await supabase
          .from('user_profiles')
          .upsert(updatedProfile);
      } catch (supabaseError) {
        console.log('[MOCK] Supabase update failed, continuing with mock data');
      }

      // Update local state with the saved profile
      setFormData(updatedProfile);
      
      // Save to our global mock storage for use across components
      saveMockProfile(updatedProfile);
      
      // Verify the profile was saved correctly in mock storage
      const savedProfile = getMockProfile(userWalletAddress);
      console.log('[MOCK] Verified saved profile:', savedProfile?.avatar_url ? 'Has avatar' : 'No avatar');
      console.log('[MOCK] Bio saved:', savedProfile?.bio);
      
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving EON-ID:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render Business Card Settings Dialog
  const renderBusinessCardSettings = () => {
    return (
      <Dialog 
        isOpen={showCardSettings} 
        onClose={() => setShowCardSettings(false)}
        title="EON-ID Display Settings"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Select Display Style</h3>
          <div className="grid grid-cols-1 gap-3">
            {CARD_STYLES.map((style) => (
              <button
                key={style.value}
                onClick={() => {
                  setFormData(prev => ({ ...prev, card_style: style.value }));
                  // Close dialog after selection
                  setShowCardSettings(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                  formData.card_style === style.value 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <span>{style.label}</span>
                {formData.card_style === style.value && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* EON-ID Preview */}
          <EonIDPreview profile={formData} />
        </div>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4`}>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">EON-ID</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <span>Public Profile</span>
                <motion.button
                  onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_public ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_public ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Upload size={24} />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <span className="text-white text-sm">Change</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Display Name</label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Title</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select a title</option>
                    <option value="EONIC DEV">EONIC DEV</option>
                    <option value="Community Member">Community Member</option>
                    <option value="EONIC Ambassador">EONIC Ambassador</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                    <option value="Founder">Founder</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Wallet Display */}
            <div>
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <motion.button
                  onClick={() => setFormData(prev => ({ ...prev, use_shortened_wallet: !prev.use_shortened_wallet }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.use_shortened_wallet ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.use_shortened_wallet ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
                <span>Use shortened wallet address</span>
              </label>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Wallet Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="A brief tagline for your wallet"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Domain</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  className="block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-24"
                  placeholder="yourdomain"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">.vault.sol</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Social Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <FaGithub className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.social_links.github || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: { ...prev.social_links, github: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="GitHub URL"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <FaTwitter className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.social_links.twitter || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: { ...prev.social_links, twitter: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Twitter URL"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <FaGlobe className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.social_links.website || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: { ...prev.social_links, website: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Website URL"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <FaDiscord className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.social_links.discord || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: { ...prev.social_links, discord: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-lg bg-[#1E1E2F]/50 border border-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Discord Username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Privacy Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <motion.button
                    onClick={() => setFormData(prev => ({ ...prev, show_real_name: !prev.show_real_name }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.show_real_name ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.show_real_name ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                  <span>Show real name</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <motion.button
                    onClick={() => setFormData(prev => ({ ...prev, allow_non_mutual_dms: !prev.allow_non_mutual_dms }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.allow_non_mutual_dms ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.allow_non_mutual_dms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                  <span>Allow DMs from non-mutuals</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <motion.button
                    onClick={() => setFormData(prev => ({ ...prev, show_holdings: !prev.show_holdings }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.show_holdings ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.show_holdings ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                  <span>Show EONIC holdings</span>
                </label>
              </div>
            </div>

            {/* Business Card Settings */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">EON-ID Display</h3>
                <motion.button
                  onClick={() => setFormData(prev => ({ ...prev, show_business_card: !prev.show_business_card }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.show_business_card ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.show_business_card ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
              
              {formData.show_business_card && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Preview of EON-ID */}
                  <EonIDPreview profile={formData} />
                  
                  <button
                    onClick={() => setShowCardSettings(true)}
                    className="w-full bg-[#1E1E2F]/80 border border-white/5 py-2 px-4 rounded-lg text-sm text-gray-300 hover:bg-[#1E1E2F] transition-colors"
                  >
                    Settings
                  </button>
                </motion.div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Save Success Message */}
            <AnimatePresence>
              {showSaveSuccess && (
                <motion.div
                  className="bg-green-900/20 text-green-300 p-4 rounded-lg mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center">
                    <div className="mr-3">✅</div>
                    <div>
                      <div className="font-medium">EON-ID settings saved successfully!</div>
                      <EonIDPreview profile={formData} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Render the business card settings dialog */}
          {renderBusinessCardSettings()}
        </div>
      )}
    </div>
  );
}

// Add a default export for cleaner dynamic imports
export default EonId; 