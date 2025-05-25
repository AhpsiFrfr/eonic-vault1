// DashboardUXRefresh.tsx – Revamped UI/UX for Eonic Vault Dashboard + Widgets

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useVaultFx } from '@/hooks/useVaultFx';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { BarChart2, Zap, Bell, Puzzle } from 'lucide-react';

const widgets = [
  {
    icon: BarChart2,
    title: 'Token Metrics',
    description: 'Track $EONIC price, volume, supply & market cap.',
    background: 'bg-gradient-to-tr from-emerald-600 to-emerald-800'
  },
  {
    icon: Puzzle,
    title: 'Active Pylons',
    description: 'Customize, activate and position your Eonic Pylons.',
    background: 'bg-gradient-to-tr from-blue-600 to-blue-800'
  },
  {
    icon: Bell,
    title: 'Announcements',
    description: 'Latest broadcasts from the Vault Core Team.',
    background: 'bg-gradient-to-tr from-indigo-600 to-indigo-800'
  },
  {
    icon: Zap,
    title: 'Vault FX',
    description: 'Toggle sound effects, glow trails, and ambient feedback.',
    background: 'bg-gradient-to-tr from-yellow-500 to-yellow-700'
  }
];

const DashboardUXRefresh: React.FC = () => {
  const { vaultFxEnabled, toggleVaultFx } = useVaultFx();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-6">
      {widgets.map(({ icon: Icon, title, description, background }) => (
        <Card key={title} className={cn('rounded-xl shadow-xl text-white', background)}>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <Icon size={20} className="opacity-80" />
            </div>
            <p className="text-sm opacity-90">{description}</p>
            {title === 'Vault FX' && (
              <div className="pt-3">
                <Toggle
                  checked={vaultFxEnabled}
                  onCheckedChange={toggleVaultFx}
                  label="Toggle Vault FX"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardUXRefresh;

// ✅ Clean layout with grid of rich widgets
// ✅ Custom FX toggle replaces audio debug panel
// ✅ Theming and spacing match Vault modern glow style
// 🧱 Ready to embed in /dashboard or replace old dashboard container 