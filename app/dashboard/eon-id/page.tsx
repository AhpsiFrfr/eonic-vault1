'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PylonSelector from '@/components/pylonManager/PylonSelector';
import { useEONIDStore } from '@/state/eonidStore';
import { supabase } from '@/lib/supabaseClient';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';
import { PylonProvider } from '@/context/PylonContext';
import { motion } from 'framer-motion';
import { Save, Upload, X, User, Globe, Mail, Github, Twitter, Settings, AlertCircle, Check, Search, Linkedin, Instagram, MessageCircle } from 'lucide-react';

const TITLES = [
  'Founder', 
  'Builder', 
  'AI Architect', 
  'Investor',
  'Web3 Pioneer',
  'Digital Nomad',
  'Crypto Enthusiast',
  'DeFi Strategist',
  'NFT Collector',
  'Community Leader',
  'Developer',
  'Designer'
];

const VAULTSKINS = [
  'Nebula Blue', 
  'Solar Flare', 
  'Quantum Violet', 
  'Emerald Pulse',
  'Cosmic Storm',
  'Digital Aurora',
  'Void Walker',
  'Glitchcore'
];

const SOCIAL_PLATFORMS = [
  { key: 'twitter', icon: Twitter, color: 'text-blue-400', placeholder: '@username' },
  { key: 'github', icon: Github, color: 'text-gray-400', placeholder: 'github.com/username' },
  { key: 'discord', icon: MessageCircle, color: 'text-indigo-400', placeholder: 'username#1234' },
  { key: 'linkedin', icon: Linkedin, color: 'text-blue-600', placeholder: 'linkedin.com/in/username' },
  { key: 'instagram', icon: Instagram, color: 'text-pink-400', placeholder: 'instagram.com/username' },
  { key: 'website', icon: Globe, color: 'text-green-400', placeholder: 'your-website.com' }
];

export default function EonIDPage() {
  const { profile, updateProfile } = useEONIDStore();
  const [formData, setFormData] = useState({
    displayName: '',
    title: '',
    bio: '',
    walletDomain: '',
    vaultskin: '',
    avatar: '',
    socialLinks: {
      twitter: '',
      github: '',
      discord: '',
      linkedin: '',
      instagram: '',
      website: ''
    }
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [domainAvailability, setDomainAvailability] = useState<boolean | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [activeSocialInputs, setActiveSocialInputs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProfile = async () => {
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
          bio: profile.bio || '',
          walletDomain: profile.domain || '',
          vaultskin: 'Nebula Blue',
          avatar: profile.avatarUrl || '',
          socialLinks
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
        if (!userId) return;
        
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!data) return;
        
        const socials = data.socials || {};
        setFormData(prev => ({
          ...prev,
          displayName: data.displayName || prev.displayName,
          title: data.title || prev.title,
          bio: data.bio || prev.bio,
          vaultskin: data.vaultskin || 'Nebula Blue',
          walletDomain: data.wallet_domain || data.domain || prev.walletDomain,
          avatar: data.avatar || prev.avatar,
          socialLinks: {
            twitter: data.twitter || socials.twitter || prev.socialLinks.twitter,
            github: data.github || socials.github || prev.socialLinks.github,
            discord: data.discord || socials.discord || prev.socialLinks.discord,
            linkedin: data.linkedin || socials.linkedin || prev.socialLinks.linkedin,
            instagram: data.instagram || socials.instagram || prev.socialLinks.instagram,
            website: data.website || socials.website || prev.socialLinks.website
          }
        }));

        // Update avatar preview
        if (data.avatar && !avatarPreview) {
          setAvatarPreview(data.avatar);
        }

        // Update active social inputs
        const activeSocials = new Set<string>();
        const allSocials = {
          twitter: data.twitter || socials.twitter,
          github: data.github || socials.github,
          discord: data.discord || socials.discord,
          linkedin: data.linkedin || socials.linkedin,
          instagram: data.instagram || socials.instagram,
          website: data.website || socials.website
        };
        
        Object.entries(allSocials).forEach(([key, value]) => {
          if (value) activeSocials.add(key);
        });
        setActiveSocialInputs(prev => new Set([...Array.from(prev), ...Array.from(activeSocials)]));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (saveSuccess) setSaveSuccess(false);

    // Check domain availability when wallet domain changes
    if (name === 'walletDomain' && value.length > 2) {
      checkDomainAvailability(value);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    if (saveSuccess) setSaveSuccess(false);
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setFormData(prev => ({ ...prev, avatar: result }));
      if (saveSuccess) setSaveSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, avatar: '' }));
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      console.log('🔄 Starting save process...');
      console.log('📝 Form data to save:', formData);
      
      // Check for Supabase session
      const { data: session } = await supabase.auth.getSession();
      console.log('👤 Current session:', session);
      
      const userId = session?.session?.user?.id;
      console.log('🆔 User ID:', userId);
      
      if (userId) {
        // Save to Supabase (authenticated user)
        console.log('📖 Fetching current profile...');
        const { data: currentProfile, error: fetchError } = await supabase.from('profiles').select('*').eq('id', userId).single();
        console.log('📋 Current profile:', currentProfile);
        console.log('❌ Fetch error:', fetchError);
        
        const profileData = {
          id: userId,
          // Core identity fields for EonIDPanel
          displayName: formData.displayName,
          username: formData.displayName.toLowerCase().replace(/\s+/g, '_'),
          title: formData.title,
          bio: formData.bio,
          avatar: formData.avatar,
          domain: formData.walletDomain,
          
          // Social links for EonIDPanel
          twitter: formData.socialLinks.twitter,
          github: formData.socialLinks.github,
          discord: formData.socialLinks.discord,
          linkedin: formData.socialLinks.linkedin,
          instagram: formData.socialLinks.instagram,
          website: formData.socialLinks.website,
          
          // XP and level system (preserve existing or set defaults)
          level: currentProfile?.level || 1,
          xp: currentProfile?.xp || 250,
          xpMax: currentProfile?.xpMax || 1000,
          
          // Additional fields
          vaultskin: formData.vaultskin,
          wallet_domain: formData.walletDomain,
          socials: formData.socialLinks,
          
          updated_at: new Date().toISOString()
        };
        
        console.log('💾 Saving profile data to Supabase:', profileData);
        
        const { data: saveResult, error: saveError } = await supabase.from('profiles').upsert(profileData);
        console.log('✅ Save result:', saveResult);
        console.log('❌ Save error:', saveError);
        
        if (saveError) {
          throw saveError;
        }
      } else {
        // Demo mode: Save to localStorage
        console.log('🎭 Demo mode: Saving to localStorage...');
        const demoProfile = {
          id: 'demo-user',
          displayName: formData.displayName,
          username: formData.displayName.toLowerCase().replace(/\s+/g, '_'),
          title: formData.title,
          bio: formData.bio,
          avatar: formData.avatar,
          domain: formData.walletDomain,
          wallet_domain: formData.walletDomain,
          vaultskin: formData.vaultskin,
          level: 1,
          xp: 250,
          xpMax: 1000,
          twitter: formData.socialLinks.twitter,
          github: formData.socialLinks.github,
          discord: formData.socialLinks.discord,
          linkedin: formData.socialLinks.linkedin,
          instagram: formData.socialLinks.instagram,
          website: formData.socialLinks.website,
          socials: formData.socialLinks,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('eonic-demo-profile', JSON.stringify(demoProfile));
        console.log('✅ Demo profile saved to localStorage:', demoProfile);
      }

      // Update EON-ID store
      updateProfile({
        displayName: formData.displayName,
        title: formData.title,
        bio: formData.bio,
        domain: formData.walletDomain,
        avatarUrl: formData.avatar,
        socialLinks: formData.socialLinks
      });

      console.log('🎉 Profile saved successfully!');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('💥 Error saving profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PylonProvider>
      <VaultSidebarLayout>
        <div className="min-h-screen bg-black text-white p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                Dashboard Customization Center
              </h1>
              <p className="text-gray-400 text-lg">
                Personalize your identity and configure your dashboard layout
              </p>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Left Column - Enhanced EON-ID Manager */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-cyan-400">EON-ID Profile Manager</h2>
                  </div>

                  {/* Success/Error Messages */}
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 p-3 bg-green-950/50 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-sm">Profile saved successfully!</span>
                    </motion.div>
                  )}

                  {saveError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{saveError}</span>
                    </motion.div>
                  )}

                  {/* Avatar Section */}
                  <div className="mb-6">
                    <Label className="text-sm text-gray-300 mb-3 block">Profile Avatar</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/25">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        {avatarPreview && (
                          <button
                            onClick={removeAvatar}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600">
                            <Upload className="w-4 h-4 mr-2" />
                            {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <Label className="text-sm text-gray-300">Display Name *</Label>
                      <Input 
                        name="displayName" 
                        value={formData.displayName} 
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300">Title Selector</Label>
                      <Select name="title" value={formData.title} onChange={handleSelectChange}>
                        <SelectItem value="">Select a title</SelectItem>
                        {TITLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-300">Vaultskin Theme</Label>
                      <Select name="vaultskin" value={formData.vaultskin} onChange={handleSelectChange}>
                        <SelectItem value="">Select a theme</SelectItem>
                        {VAULTSKINS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </Select>
                    </div>
                  </div>

                  {/* Wallet Domain Claiming */}
                  <div className="mb-6">
                    <Label className="text-sm text-gray-300 mb-3 block">Claim Your Wallet Domain</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input 
                          name="walletDomain" 
                          value={formData.walletDomain} 
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="your-domain"
                        />
                        <span className="text-gray-400 text-sm">.sol</span>
                        {isCheckingDomain && (
                          <motion.div
                            className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        {domainAvailability !== null && !isCheckingDomain && (
                          <div className={`${domainAvailability ? 'text-green-400' : 'text-red-400'}`}>
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
                        onClick={() => checkDomainAvailability(formData.walletDomain)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Claim Domain
                      </Button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <Label className="text-sm text-gray-300">Bio</Label>
                    <Textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Social Links - Toggleable */}
                  <div className="mb-6">
                    <Label className="text-sm text-gray-300 mb-3 block">Social Links</Label>
                    <p className="text-xs text-gray-400 mb-3">Click logos to add social links</p>
                    
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
                            <Label className={`text-sm text-gray-300 flex items-center gap-2`}>
                              <Icon className={`w-4 h-4 ${color}`} />
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Label>
                            <Input
                              placeholder={placeholder}
                              value={formData.socialLinks[key as keyof typeof formData.socialLinks]}
                              onChange={(e) => handleSocialChange(key, e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
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

                  {/* Save Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                    onClick={handleSave}
                    disabled={isSaving || !formData.displayName}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Right Column - Preview & Pylon Manager */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Live Preview Section */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-cyan-400">Dashboard Preview</h2>
                  </div>
                  
                  {/* Preview of how it will look in the dashboard */}
                  <div className="w-full rounded-2xl bg-gradient-to-r from-[#191927] to-[#0c0c1d] p-6 border border-[#7B61FF] shadow-[0_0_20px_#7B61FF]">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {/* Avatar Preview */}
                      <div className="relative">
                        <img
                          src={avatarPreview || formData.avatar || '/images/vault-logo.png'}
                          alt="avatar preview"
                          className="w-28 h-28 rounded-full border-4 border-[#7B61FF] shadow-[0_0_20px_#7B61FF]"
                        />
                        <div className="absolute bottom-0 right-0 px-2 py-1 text-xs rounded-full bg-emerald-500 text-white">
                          LVL 1
                        </div>
                      </div>

                      {/* Identity Info Preview */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">
                          {formData.displayName || 'Your Display Name'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-emerald-400">
                            @{formData.displayName ? formData.displayName.toLowerCase().replace(/\s+/g, '_') : 'username'}
                          </span>
                          <span className="text-xs px-2 py-1 bg-[#2b2b45] rounded-full text-purple-300">
                            {formData.title || 'Builder'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {formData.walletDomain ? `${formData.walletDomain}.sol` : 'unclaimed.sol'}
                        </p>

                        {/* Social Links Preview */}
                        <div className="flex gap-3 mt-2">
                          {formData.socialLinks.twitter && (
                            <span className="text-cyan-400">🐦</span>
                          )}
                          {formData.socialLinks.github && (
                            <span className="text-gray-400">💻</span>
                          )}
                          {formData.socialLinks.discord && (
                            <span className="text-indigo-400">💬</span>
                          )}
                          {formData.socialLinks.linkedin && (
                            <span className="text-blue-600">🔗</span>
                          )}
                          {formData.socialLinks.instagram && (
                            <span className="text-pink-400">📷</span>
                          )}
                          {formData.socialLinks.website && (
                            <span className="text-green-400">🌐</span>
                          )}
                        </div>

                        {/* XP Bar Preview */}
                        <div className="mt-4">
                          <div className="text-xs mb-1 text-gray-400">
                            XP Progress
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full"
                              style={{ width: '25%' }}
                            />
                          </div>
                          <div className="text-right text-xs text-gray-400 mt-1">
                            250 / 1000 (25%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    This is how your EON-ID will appear on your dashboard
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-purple-400">Dashboard Layout Manager</h2>
                  </div>
                  
                  <PylonSelector />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </VaultSidebarLayout>
    </PylonProvider>
  );
} 