import { create } from 'zustand';
import { pylonConfig } from '@/config/pylons';

interface DashboardState {
  hovered: string | null;
  setHovered: (name: string | null) => void;
  pylonStates: Record<string, boolean>;
  togglePylon: (name: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  hovered: null,
  setHovered: (name) => set({ hovered: name }),
  pylonStates: Object.fromEntries(pylonConfig.map(pylon => [pylon.name, true])),
  togglePylon: (name) => set((state) => ({
    pylonStates: {
      ...state.pylonStates,
      [name]: !state.pylonStates[name]
    }
  }))
})); 