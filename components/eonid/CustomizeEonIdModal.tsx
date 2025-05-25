'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEONIDStore } from '@/state/eonidStore';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Upload, X, Twitter, Github, MessageCircle, Save, User, AlertCircle, Check, Search, Globe, Linkedin, Instagram } from 'lucide-react';

interface CustomizeEonIdModalProps {
  open: boolean;
  onClose: () => void;
}

const VAULTSKINS = [
  'Nebula Blue',
  'Quantum Violet', 
  'Solar Flare',
  'Emerald Pulse',
  'Glitchcore',
  'Cosmic Storm',
  'Digital Aurora',
  'Void Walker'
];

const TITLES = [
  'Cosmic Explorer',
  'Founder',
  'Builder', 
  'Investor',
  'AI Architect',
  'Web3 Pioneer',
  'Digital Nomad',
  'Crypto Enthusiast',
  'DeFi Strategist',
  'NFT Collector',
  'Community Leader',
  'Developer'
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', icon: Twitter, color: 'text-blue-400', placeholder: 'https://twitter.com/username' },
  { key: 'github', icon: Github, color: 'text-gray-400', placeholder: 'https://github.com/username' },
  { key: 'discord', icon: MessageCircle, color: 'text-indigo-400', placeholder: 'username#1234' },
  { key: 'linkedin', icon: Linkedin, color: 'text-blue-600', placeholder: 'https://linkedin.com/in/username' },
  { key: 'instagram', icon: Instagram, color: 'text-pink-400', placeholder: 'https://instagram.com/username' },
  { key: 'website', icon: Globe, color: 'text-green-400', placeholder: 'https://yourwebsite.com' }
];

export default function CustomizeEonIdModal({ open, onClose }: CustomizeEonIdModalProps) {
  const { profile, updateProfile } = useEONIDStore();
  
  const [formData, setFormData] = useState({
    displayName: '',
    title: '',
    walletDomain: '', 
    bio: '',
    avatarUrl: '',
    socialLinks: {
      twitter: '',
      github: '',
      discord: '',
      linkedin: '',
      instagram: '',
      website: ''
    },
    vaultskin: 'Nebula Blue'
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [domainAvailability, setDomainAvailability] = useState<boolean | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [activeSocialInputs, setActiveSocialInputs] = useState<Set<string>>(new Set());

  // Load profile data when modal opens (from both EON-ID store and Supabase)
  useEffect(() => {
    const loadProfile = async () => {
      if (!open) return;

      // Load from EON-ID store first
      if (profile) {
        const socialLinks = {
          twitter: profile.socialLinks?.twitter || '',
          github: profile.socialLinks?.github || '',
          discord: profile.socialLinks?.discord || '',
          linkedin: '',
          instagram: '',
          website: ''
        };

        setFormData({
          displayName: profile.displayName || '',
          title: profile.title || '',
          walletDomain: profile.domain || '',
          bio: profile.bio || '',
          avatarUrl: profile.avatarUrl || '',
          socialLinks,
          vaultskin: 'Nebula Blue' // Default, will be loaded from Supabase
        });
        setAvatarPreview(profile.avatarUrl || null);

        // Set active social inputs for existing links
        const activeSocials = new Set<string>();
        Object.entries(socialLinks).forEach(([key, value]) => {
          if (value) activeSocials.add(key);
        });
        setActiveSocialInputs(activeSocials);
      }

      // Load additional data from Supabase
      try {
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;

        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            console.warn('No Supabase profile found, using EON-ID store data:', error.message);
          } else {
            const socials = data.socials || {};
            
            // Merge Supabase data with EON-ID store data
            setFormData(prev => ({
              ...prev,
              walletDomain: data.wallet_domain || prev.walletDomain,
              vaultskin: data.vaultskin || 'Nebula Blue',
              socialLinks: {
                ...prev.socialLinks,
                ...socials
              }
            }));

            // Update active social inputs
            const activeSocials = new Set<string>();
            Object.entries(socials).forEach(([key, value]) => {
              if (value) activeSocials.add(key);
            });
            setActiveSocialInputs(prev => new Set([...Array.from(prev), ...Array.from(activeSocials)]));
          }
        }
      } catch (error) {
        console.error('Error loading Supabase profile:', error);
      }
    };

    loadProfile();
  }, [open, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check domain availability when wallet domain changes
    if (name === 'walletDomain' && value.length > 2) {
      checkDomainAvailability(value);
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSocialInput = (platform: string) => {
    setActiveSocialInputs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
        // Clear the input when deactivating
        setFormData(prevData => ({
          ...prevData,
          socialLinks: {
            ...prevData.socialLinks,
            [platform]: ''
          }
        }));
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const checkDomainAvailability = async (domain: string) => {
    setIsCheckingDomain(true);
    try {
      // Simulate domain availability check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock availability logic (in real app, this would be an API call)
      const unavailableDomains = ['eonic', 'vault', 'admin', 'test', 'user'];
      const isAvailable = !unavailableDomains.includes(domain.toLowerCase()) && domain.length >= 3;
      setDomainAvailability(isAvailable);
    } catch (error) {
      console.error('Error checking domain availability:', error);
      setDomainAvailability(null);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({
          ...prev,
          avatarUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({
      ...prev,
      avatarUrl: ''
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Save to Supabase first
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            username: formData.displayName,
            title: formData.title,
            wallet_domain: formData.walletDomain,
            bio: formData.bio,
            vaultskin: formData.vaultskin,
            avatar: formData.avatarUrl,
            socials: formData.socialLinks,
            updated_at: new Date().toISOString()
          });

        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }
      }

      // Update the EON-ID store
      updateProfile({
        displayName: formData.displayName,
        title: formData.title,
        domain: formData.walletDomain,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        socialLinks: formData.socialLinks
      });

      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setSaveError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      isOpen={open} 
      onClose={handleClose}
      title="Customize Your EON-ID"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Left Column - Avatar & Theme */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold mb-3 text-cyan-400">Profile Avatar</h3>
            
            <div className="relative mx-auto w-32 h-32 mb-4">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-cyan-500 shadow-glow-blue"
                  />
                  <button
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="w-full bg-gray-700 hover:bg-gray-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload Avatar
              </Button>
            </div>
          </div>

          {/* Vaultskin Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vaultskin Theme
            </label>
            <Select
              value={formData.vaultskin}
              onChange={(e) => handleSelectChange('vaultskin', e.target.value)}
            >
              {VAULTSKINS.map((skin) => (
                <SelectItem key={skin} value={skin}>{skin}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Middle Column - Basic Info & Domain */}
        <div className="space-y-4">
          <h3 className="font-semibold text-cyan-400">Profile Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name *
            </label>
            <Input
              name="displayName"
              placeholder="Enter your display name"
              value={formData.displayName}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title Selector
            </label>
            <Select
              value={formData.title}
              onChange={(e) => handleSelectChange('title', e.target.value)}
            >
              <SelectItem value="">Select a title</SelectItem>
              {TITLES.map((title) => (
                <SelectItem key={title} value={title}>{title}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Wallet Domain Claiming */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Claim Your Wallet Domain
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Input
                  name="walletDomain"
                  placeholder="your-domain"
                  value={formData.walletDomain}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
                <span className="text-gray-400 ml-2">.sol</span>
                {isCheckingDomain && (
                  <motion.div
                    className="ml-2 w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
                {domainAvailability !== null && !isCheckingDomain && (
                  <div className={`ml-2 ${domainAvailability ? 'text-green-400' : 'text-red-400'}`}>
                    {domainAvailability ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                )}
              </div>
              {domainAvailability !== null && !isCheckingDomain && (
                <p className={`text-xs ${domainAvailability ? 'text-green-400' : 'text-red-400'}`}>
                  {domainAvailability ? 'Domain is available!' : 'Domain is not available'}
                </p>
              )}
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-sm"
                disabled={!formData.walletDomain || domainAvailability === false}
              >
                <Search className="w-4 h-4 mr-2" />
                Claim Domain
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <Textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
          </div>
        </div>

        {/* Right Column - Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-cyan-400">Social Links</h3>
          <p className="text-sm text-gray-400">Click logos to add social links</p>

          {/* Social Platform Toggles */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {SOCIAL_PLATFORMS.map(({ key, icon: Icon, color }) => (
              <motion.button
                key={key}
                onClick={() => toggleSocialInput(key)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                  ${activeSocialInputs.has(key) 
                    ? `border-cyan-500 bg-cyan-500/20 ${color}` 
                    : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>

          {/* Active Social Inputs */}
          <div className="space-y-3">
            {SOCIAL_PLATFORMS.map(({ key, icon: Icon, color, placeholder }) => {
              if (!activeSocialInputs.has(key)) return null;
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className={`block text-sm font-medium text-gray-300 flex items-center gap-2`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <Input
                    placeholder={placeholder}
                    value={formData.socialLinks[key as keyof typeof formData.socialLinks]}
                    onChange={(e) => handleSocialChange(key, e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </motion.div>
              );
            })}
          </div>

          {activeSocialInputs.size === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No social links selected
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{saveError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isSaving}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving || !formData.displayName}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          {isSaving ? (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Dialog>
  );
} 