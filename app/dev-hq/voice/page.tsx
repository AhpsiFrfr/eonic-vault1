'use client';

import React from 'react';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';
import DevHQVoiceLounge from '../components/DevHQVoiceLounge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Users, Mic, Settings } from 'lucide-react';

export default function DevHQVoicePage() {
  return (
    <VaultSidebarLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-glow mb-2">🎙️ Voice Communication</h1>
            <p className="text-gray-400">Real-time voice collaboration for development teams</p>
          </div>

          {/* Voice Lounge Component */}
          <div className="mb-8">
            <DevHQVoiceLounge />
          </div>

          {/* Voice Settings and Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microphone</span>
                    <span className="text-xs text-green-400">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-join on channel load</span>
                    <span className="text-xs text-blue-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push to talk</span>
                    <span className="text-xs text-gray-400">Disabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Voice Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Real-time audio streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Mute/unmute controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Multi-user support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle>📋 Voice Channel Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Please mute when not speaking to reduce background noise</p>
                <p>• Use push-to-talk for noisy environments</p>
                <p>• Be respectful and professional during voice conversations</p>
                <p>• Voice channels are logged for quality and training purposes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VaultSidebarLayout>
  );
} 