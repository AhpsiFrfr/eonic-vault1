'use client'

import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { pylonConfig } from '@/config/pylons'
import SortablePylonWrapper from '../../components/ui/SortablePylonWrapper'
import { GlowLevelProvider } from '../../context/GlowLevelContext'
import { AudioVolumeProvider } from '../components/dashboard/AudioVolumeContext'
import VaultSFX from '../components/dashboard/VaultSFX'
import { useDashboardStore } from '@/state/dashboard'
import { DashboardContainer } from '@/components/ui/DashboardContainer'
import { DashboardHeader } from '@/components/ui/DashboardHeader'
import { ENIC0Panel } from '@/components/enic/ENIC0Panel'
import PylonControlSidebar from '@/components/ui/PylonControlSidebar'

type PylonName = typeof pylonConfig[number]['name'];

const usageGlow: Record<PylonName, string> = {
  'XP Tracker': 'shadow-[0_0_8px_rgba(0,255,255,0.5)]',
  'Token': 'shadow-[0_0_8px_rgba(255,215,0,0.6)]',
  'Vault Reputation': 'shadow-[0_0_8px_rgba(128,0,255,0.5)]',
  'Timepiece Evolution': 'shadow-[0_0_8px_rgba(0,153,255,0.5)]',
  'Announcements': 'shadow-[0_0_8px_rgba(255,105,180,0.5)]',
  'Audio Control': 'shadow-[0_0_8px_rgba(75,0,130,0.5)]',
  'Audio Settings': 'shadow-[0_0_8px_rgba(138,43,226,0.5)]',
  'Glow Level Tester': 'shadow-[0_0_8px_rgba(0,212,255,0.5)]',
  'Radio': 'shadow-[0_0_8px_rgba(0,255,255,0.5)]'
};

const pylonCommentary: Record<PylonName, string> = {
  'XP Tracker': "Your experience points are growing nicely. Keep engaging with the platform to level up faster!",
  'Token': "I see you're managing your EONIC tokens. Remember, they're not just currency - they're your key to exclusive features!",
  'Vault Reputation': "A strong reputation opens new doors. You're building trust in the community!",
  'Timepiece Evolution': "Your timepiece is evolving! Each stage brings new capabilities and aesthetics.",
  'Announcements': "Stay informed with the latest updates. Knowledge is power in the EONIC ecosystem!",
  'Audio Control': "The right sound effects can enhance your experience. Try different combinations!",
  'Audio Settings': "Perfect audio balance is crucial for an immersive experience. Adjust to your liking!",
  'Glow Level Tester': "This tool helps visualize how XP levels affect the visual feedback across the Vault interface.",
  'Radio': "Immerse yourself in the ambient soundscapes of the EONIC Vault. Each track enhances your experience!"
};

const pylonDescriptions: Record<PylonName, string> = {
  'XP Tracker': "Experience Points Progress",
  'Token': "EONIC Token Management",
  'Vault Reputation': "Community Trust Score",
  'Timepiece Evolution': "NFT Development Stages",
  'Announcements': "System Updates & News",
  'Audio Control': "Sound Effect Controls",
  'Audio Settings': "Audio Configuration",
  'Glow Level Tester': "Visual Feedback Testing Tool",
  'Radio': "Ambient Soundscape Player"
};

// Create a map of pylon components
const createPylonComponents = () => {
  const components: Record<string, any> = {};
  pylonConfig.forEach(({ name }) => {
    components[name] = require(`../../components/pylons/${name.replace(/\s+/g, '')}Pylon`).default;
  });
  return components;
};

export default function Dashboard() {
  const allPylons = createPylonComponents();
  const { hovered, pylonStates, togglePylon } = useDashboardStore();
  const sensors = useSensors(useSensor(PointerSensor))
  const [isENIC0Open, setIsENIC0Open] = useState(false);

  // Sample user data - replace with actual user data in production
  const userData = {
    name: 'Buoyanft',
    title: 'EONIC DEV'
  };

  return (
    <DashboardContainer>
      <AudioVolumeProvider>
        <GlowLevelProvider>
          <VaultSFX />
          
          <DashboardHeader 
            userName={userData.name}
            userTitle={userData.title}
          />

          <div className="px-6 pb-16">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                // Handle drag end if needed
              }}
            >
              <SortableContext items={Object.keys(pylonStates)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Object.entries(pylonStates).map(([name, isVisible]) => {
                    if (!isVisible) return null;
                    const Comp = allPylons[name as PylonName];
                    return (
                      <SortablePylonWrapper key={name} id={name} glow={hovered === name ? usageGlow[name as PylonName] : ''}>
                        <div className="relative min-h-[180px] w-full h-full group">
                          {hovered === name && (
                            <div className="absolute -top-10 left-0 flex items-center z-50 w-full px-2">
                              <div className="flex items-center bg-[#0a0a0a]/90 text-cyan-200 text-xs px-2 py-1.5 rounded-lg shadow-lg w-full border border-cyan-800/30">
                                <img
                                  src="/images/enico-icon.png"
                                  alt="ENIC.0"
                                  className="w-6 h-6 rounded-full border border-cyan-400 shadow-md animate-pulse mr-2 flex-shrink-0"
                                />
                                <p className="line-clamp-2 text-[10px] leading-tight">
                                  {pylonCommentary[name as PylonName]}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="h-full">
                            <Comp />
                          </div>
                          {hovered === name && (
                            <div className="absolute bottom-0 left-0 right-0 text-[10px] text-blue-300 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-b-lg border-t border-cyan-800/30 italic">
                              {pylonDescriptions[name as PylonName]}
                            </div>
                          )}
                        </div>
                      </SortablePylonWrapper>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* ENIC.0 activation button */}
          <button
            className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-egyptian-base border border-gold flex items-center justify-center shadow-glow-blue z-40"
            onClick={() => setIsENIC0Open(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#F5D16F" strokeWidth="1.5" />
              <path d="M8 12H16" stroke="#F5D16F" strokeWidth="1.5" />
              <path d="M12 8V16" stroke="#F5D16F" strokeWidth="1.5" />
            </svg>
          </button>
          
          {/* ENIC.0 Panel */}
          <ENIC0Panel 
            isOpen={isENIC0Open}
            onClose={() => setIsENIC0Open(false)}
          />

          {/* Pylon Control Sidebar */}
          <PylonControlSidebar 
            state={pylonStates}
            onToggle={togglePylon}
          />
        </GlowLevelProvider>
      </AudioVolumeProvider>
    </DashboardContainer>
  )
}
