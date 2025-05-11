'use client';

import { useState, useEffect } from 'react';
import { getMockProfile, saveMockProfile, MockProfile } from '../utils/mock-data';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface EonIDSettingsProps {
  userWalletAddress: string;
  onUpdate?: (settings: any) => void;
}

// Mock data for earned titles
const earnedTitles = [
  { id: 'vault-pioneer', name: 'Vault Pioneer' },
  { id: 'eonic-dev', name: 'EONIC DEV' },
  { id: 'community-mod', name: 'Community Moderator' },
  { id: 'timepiece-holder', name: 'Timepiece Holder' },
  { id: 'contributor', name: 'Contributor' }
];

export default function EonIDSettings({ userWalletAddress, onUpdate }: EonIDSettingsProps) {
  const [displayName, setDisplayName] = useState('');
  const [domainPrefix, setDomainPrefix] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load existing data on component mount
  useEffect(() => {
    const profile = getMockProfile(userWalletAddress);
    if (profile) {
      setDisplayName(profile.display_name || '');
      setDomainPrefix(profile.domain || '');
      setSelectedTitle(profile.title || '');
      setAvatarPreview(profile.avatar_url || '');
    }
  }, [userWalletAddress]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get current profile
      const currentProfile = getMockProfile(userWalletAddress);
      
      // Create updated profile
      const updatedProfile: MockProfile = {
        // If no current profile exists, create default values for required fields
        id: currentProfile?.id || `mock-${Date.now()}`,
        wallet_address: userWalletAddress,
        display_name: displayName,
        domain: domainPrefix,
        title: selectedTitle,
        avatar_url: avatarPreview,
        bio: currentProfile?.bio || '',
        use_shortened_wallet: currentProfile?.use_shortened_wallet || false,
        tagline: currentProfile?.tagline || '',
        show_real_name: currentProfile?.show_real_name || false,
        allow_non_mutual_dms: currentProfile?.allow_non_mutual_dms || true,
        show_holdings: currentProfile?.show_holdings || true,
        is_public: currentProfile?.is_public || true,
        social_links: currentProfile?.social_links || {},
        updated_at: new Date().toISOString(),
        created_at: currentProfile?.created_at || new Date().toISOString()
      };
      
      // Save profile
      saveMockProfile(updatedProfile);
      
      // Update parent component if callback exists
      if (onUpdate) {
        onUpdate(updatedProfile);
      }
      
      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving EON-ID settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Customize EON-ID</h2>
      
      <div className="space-y-5">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile"
                  width={80}
                  height={80}
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
              <span className="text-white text-xs">Change</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="text-sm text-gray-400">
            Upload a profile picture for your EON-ID
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-300">Display Name</label>
          <input
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-300">Vault Domain</label>
          <div className="flex items-center bg-gray-800 rounded border border-gray-600 px-2">
            <input
              className="flex-1 bg-transparent py-2 text-white"
              value={domainPrefix}
              onChange={(e) => setDomainPrefix(e.target.value)}
              placeholder="username"
            />
            <span className="text-gray-500 text-sm ml-1">.vault.sol</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-300">Title</label>
          <select
            className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <option value="">Select a title</option>
            {earnedTitles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.name}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Information'}
          </button>
          
          {showSaveSuccess && (
            <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-center text-green-400 text-sm">
              Changes saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 