'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { availablePylons } from '@/constants/pylons';
import EonIDPanel from '@/components/pylons/EonIDPanel';
import TokenOverviewPylon from '@/components/pylons/TokenOverviewPylon';
import EonicTokenPricePylon from '@/components/pylons/EonicTokenPricePylon';
import EonicTokenOverviewPylon from '@/components/pylons/EonicTokenOverviewPylon';
import VaultSidebarLayout from '@/components/shared/VaultSidebarLayout';

// Component mapping for pylons
const pylonComponents: { [key: string]: React.ComponentType } = {
  'eonic-token-overview': TokenOverviewPylon,
  'eonic-token-price': EonicTokenPricePylon,
  'token-overview': EonicTokenOverviewPylon,
};

export default function EonicDashboard() {
  const [activePylons, setActivePylons] = useState<string[]>([]);

  useEffect(() => {
    const loadPylons = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        if (userId) {
          const { data } = await supabase.from('profiles').select('activePylons').eq('id', userId).single();
          const pylons = data?.activePylons || ['eonic-token-overview', 'eonic-token-price'];
          setActivePylons(pylons);
        } else {
          // Default pylons for non-authenticated users
          setActivePylons(['eonic-token-overview', 'eonic-token-price']);
        }
      } catch (error) {
        console.error('Error loading pylons:', error);
        // Fallback to default pylons
        setActivePylons(['eonic-token-overview', 'eonic-token-price']);
      }
    };
    loadPylons();
  }, []);

  return (
    <VaultSidebarLayout>
      <div className="min-h-screen w-full px-6 py-8 bg-[#0b0c1d] text-white">
        {/* EON-ID Banner Block */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#191927] to-[#0c0c1d] p-6 mb-8 border border-[#7B61FF] shadow-[0_0_20px_#7B61FF]">
          <EonIDPanel />
        </div>

        {/* Dynamic Pylon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activePylons
            .filter(pylonId => pylonComponents[pylonId])
            .map(pylonId => {
              const Component = pylonComponents[pylonId];
              const pylonInfo = availablePylons.find(p => p.id === pylonId);
              return (
                <div key={pylonId} className="bg-[#131324] rounded-xl p-4 border border-[#2e2e4d] shadow-md">
                  <Component />
                </div>
              );
            })}
        </div>

        {/* Empty State */}
        {activePylons.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Loading Dashboard...</h2>
            <p className="text-gray-500 mb-6">
              Setting up your personalized EONIC Vault experience.
            </p>
          </div>
        )}
      </div>
    </VaultSidebarLayout>
  );
}
