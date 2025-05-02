import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import axios from 'axios';

interface ProfileSettingsProps {
  walletAddress: string;
  onClose?: () => void;
}

export default function ProfileSettings({ walletAddress, onClose }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [walletAddress]);

  const loadProfile = async () => {
    try {
      console.log('Loading profile for wallet:', walletAddress);
      setLoading(true);
      setError('');

      // Load profile from API
      const response = await axios.get(`/api/profile?address=${walletAddress}`);
      console.log('API Response:', response);
      const profile = response.data;

      if (profile) {
        console.log('Setting profile data:', profile);
        setDisplayName(profile.display_name || '');
        setAvatarUrl(profile.avatar_url || '');
        setStatus(profile.status || 'online');
      } else {
        console.log('No profile data received');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || error.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError('');

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Upload via API
      const uploadResponse = await axios.post('/api/avatar', formData);
      const newAvatarUrl = uploadResponse.data.url;
      setAvatarUrl(newAvatarUrl);

      // Update profile with new avatar URL
      await axios.post('/api/profile', {
        user_address: walletAddress,
        avatar_url: newAvatarUrl
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setError(error.response?.data?.error || error.message || 'Error uploading avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      // Update profile via API
      await axios.post('/api/profile', {
        user_address: walletAddress,
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
        status: status || 'online'
      });

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || error.message || 'Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
      
      <div className="mb-4 p-2 bg-gray-700 rounded text-sm text-gray-300 break-all">
        <div>Wallet Address: {walletAddress}</div>
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Error: {error || 'none'}</div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Avatar</label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-400">
                  {displayName ? displayName[0].toUpperCase() : 'A'}
                </span>
              )}
            </div>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
              {uploading ? 'Uploading...' : 'Upload New'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your display name"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'online' | 'offline')}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
