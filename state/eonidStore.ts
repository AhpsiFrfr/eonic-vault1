import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/utils/user';
import { getMockProfile } from '@/utils/mock-data';

// Define types for our store
interface OrbitalModule {
  id: string;
  type: 'tokenHoldings' | 'timepiece' | 'socialLinks' | 'reputation';
  title: string;
  subtitle: string;
  position: { x: number; y: number };
  isExpanded?: boolean;
  isVisible?: boolean;
  orbitRing?: number;
  orbitAngle?: number;
  data: any;
}

export interface Profile {
  id: string;
  displayName: string;
  title: string;
  bio: string;
  domain: string;
  avatarUrl: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  privacySettings?: {
    isPublic: boolean;
    showSocialLinks: boolean;
    showTokenHoldings: boolean;
    showReputation: boolean;
  };
}

interface ModuleLayout {
  position: { x: number; y: number };
  orbitRing?: number;
  orbitAngle?: number;
  isVisible?: boolean;
}

interface LayoutMemory {
  userId: string;
  moduleLayouts: {
    [moduleId: string]: ModuleLayout;
  };
  lastUpdated: number;
}

interface EONIDState {
  profile: Profile | null;
  orbitalModules: OrbitalModule[];
  layoutMemory: LayoutMemory[];
  isLoading: boolean;
  error: string | null;
  performanceMode: 'high' | 'medium' | 'low';
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => void;
  addOrbitalModule: (module: Omit<OrbitalModule, 'id'>) => void;
  removeOrbitalModule: (moduleId: string) => void;
  updateOrbitalModule: (moduleId: string, data: Partial<OrbitalModule>) => void;
  updateOrbitalModulePosition: (moduleId: string, x: number, y: number) => void;
  toggleOrbitalModuleExpansion: (moduleId: string) => void;
  toggleOrbitalModuleVisibility: (moduleId: string, isVisible: boolean) => void;
  saveLayoutMemory: (userId: string) => void;
  loadLayoutMemory: (userId: string) => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  resetState: () => void;
}

// Define orbital rings for consistent snap-to functionality
export const ORBITAL_RINGS = [
  { radius: 120, name: 'Inner Ring' },
  { radius: 200, name: 'Middle Ring' },
  { radius: 280, name: 'Outer Ring' }
];

// Helper function to convert UserProfile to Profile
const convertUserProfileToProfile = (userProfile: UserProfile): Profile => ({
  id: userProfile.id,
  displayName: userProfile.display_name,
  title: userProfile.title,
  bio: userProfile.bio,
  domain: userProfile.solana_domain || userProfile.wallet_address,
  avatarUrl: userProfile.avatar_url,
  socialLinks: {
    twitter: '',
    github: '',
    discord: ''
  },
  privacySettings: {
    isPublic: userProfile.is_public,
    showSocialLinks: true,
    showTokenHoldings: true,
    showReputation: true
  }
});

// Default orbital modules
const defaultModules: OrbitalModule[] = [
  {
    id: 'tokenHoldings',
    type: 'tokenHoldings',
    title: 'Token Holdings',
    subtitle: 'View your token portfolio',
    position: { x: 150, y: 0 },
    isExpanded: false,
    isVisible: true,
    orbitRing: 1,
    orbitAngle: 0,
    data: {}
  },
  {
    id: 'timepiece',
    type: 'timepiece',
    title: 'Timepiece',
    subtitle: 'Your NFT timepiece',
    position: { x: 0, y: 150 },
    isExpanded: false,
    isVisible: true,
    orbitRing: 1,
    orbitAngle: 90,
    data: {}
  },
  {
    id: 'socialLinks',
    type: 'socialLinks',
    title: 'Social Links',
    subtitle: 'Connect with others',
    position: { x: -150, y: 0 },
    isExpanded: false,
    isVisible: true,
    orbitRing: 1,
    orbitAngle: 180,
    data: {}
  },
  {
    id: 'reputation',
    type: 'reputation',
    title: 'Reputation',
    subtitle: 'Your community standing',
    position: { x: 0, y: -150 },
    isExpanded: false,
    isVisible: true,
    orbitRing: 1,
    orbitAngle: 270,
    data: {}
  }
];

// Create the store with Zustand
export const useEONIDStore = create<EONIDState>()(
  persist(
    (set, get) => ({
      profile: null,
      orbitalModules: defaultModules,
      layoutMemory: [],
      isLoading: false,
      error: null,
      performanceMode: 'high',
      
      // Fetch profile data from API
      fetchProfile: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // In development, use mock data
          if (process.env.NODE_ENV === 'development') {
            const userProfile = await getMockProfile(userId);
            
            if (!userProfile) {
              throw new Error('Failed to get mock profile');
            }
            
            const profile = convertUserProfileToProfile(userProfile);
            
            set({
              profile,
              orbitalModules: defaultModules,
              isLoading: false
            });
            return;
          }
          
          // In production, fetch from API
          const response = await fetch(`/api/profile/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
          }
          
          const data = await response.json();
          set({
            profile: data.profile,
            orbitalModules: data.modules || defaultModules,
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false 
          });
          
          // Fallback to mock data in development if API fails
          if (process.env.NODE_ENV === 'development') {
            const mockProfile: Profile = {
              id: userId,
              displayName: 'Buoyant',
              title: 'Cosmic Explorer',
              bio: 'Exploring the digital cosmos and building the future of Web4',
              domain: 'buoyant.eonic',
              avatarUrl: '/images/avatars/default.svg',
              socialLinks: {
                twitter: 'https://twitter.com/buoyant',
                github: 'https://github.com/buoyant'
              },
              privacySettings: {
                isPublic: true,
                showSocialLinks: true,
                showTokenHoldings: true,
                showReputation: true
              }
            };
            
            set({
              profile: mockProfile,
              orbitalModules: defaultModules
            });
          }
        }
      },
      
      // Update profile data
      updateProfile: (profileData: Partial<Profile>) => {
        const currentProfile = get().profile;
        
        if (!currentProfile) {
          set({ error: 'No profile to update' });
          return;
        }
        
        set({ 
          profile: { ...currentProfile, ...profileData },
          error: null
        });
      },
      
      // Add a new orbital module
      addOrbitalModule: (moduleData: Omit<OrbitalModule, 'id'>) => {
        const newModule: OrbitalModule = {
          ...moduleData,
          id: `module-${Date.now()}`,
          isVisible: true
        };
        
        // Calculate orbit ring and angle if not provided
        if (!newModule.orbitRing) {
          // Default to middle ring
          newModule.orbitRing = 1;
          
          // Find an available angle on the ring
          const existingModules = get().orbitalModules.filter(m => m.orbitRing === 1);
          const usedAngles = existingModules.map(m => m.orbitAngle || 0);
          
          // Find the largest gap between used angles
          let bestAngle = 0;
          let largestGap = 0;
          
          if (usedAngles.length > 0) {
            // Sort angles
            const sortedAngles = [...usedAngles].sort((a, b) => a - b);
            
            // Check gaps between angles
            for (let i = 0; i < sortedAngles.length; i++) {
              const nextIndex = (i + 1) % sortedAngles.length;
              let gap = sortedAngles[nextIndex] - sortedAngles[i];
              
              // Handle wrap-around
              if (gap < 0) gap += 360;
              
              if (gap > largestGap) {
                largestGap = gap;
                bestAngle = (sortedAngles[i] + gap / 2) % 360;
              }
            }
          } else {
            // No modules on this ring yet, place at top
            bestAngle = 0;
          }
          
          newModule.orbitAngle = bestAngle;
          
          // Convert angle to position
          const ring = ORBITAL_RINGS[newModule.orbitRing];
          newModule.position = {
            x: Math.cos(bestAngle * Math.PI / 180) * ring.radius,
            y: Math.sin(bestAngle * Math.PI / 180) * ring.radius
          };
        }
        
        set(state => ({ 
          orbitalModules: [...state.orbitalModules, newModule],
          error: null
        }));
        
        // Save layout memory
        const state = get();
        if (state.profile?.id) {
          state.saveLayoutMemory(state.profile.id);
        }
      },
      
      // Remove an orbital module
      removeOrbitalModule: (moduleId: string) => {
        set(state => ({ 
          orbitalModules: state.orbitalModules.filter(module => module.id !== moduleId),
          error: null
        }));
        
        // Save layout memory
        const state = get();
        if (state.profile?.id) {
          state.saveLayoutMemory(state.profile.id);
        }
      },
      
      // Update an orbital module
      updateOrbitalModule: (moduleId: string, data: Partial<OrbitalModule>) => {
        set(state => ({ 
          orbitalModules: state.orbitalModules.map(module => 
            module.id === moduleId ? { ...module, ...data } : module
          ),
          error: null
        }));
        
        // Save layout memory if position related properties changed
        const state = get();
        if (data.position || data.orbitRing || data.orbitAngle) {
          if (state.profile?.id) {
            state.saveLayoutMemory(state.profile.id);
          }
        }
      },
      
      // Update orbital module position
      updateOrbitalModulePosition: (moduleId: string, x: number, y: number) => {
        const modules = get().orbitalModules.map(module => 
          module.id === moduleId 
            ? { ...module, position: { x, y } }
            : module
        );
        
        set({ orbitalModules: modules });
      },
      
      // Toggle module expansion
      toggleOrbitalModuleExpansion: (moduleId: string) => {
        const modules = get().orbitalModules;
        const moduleIndex = modules.findIndex(m => m.id === moduleId);
        
        if (moduleIndex === -1) {
          set({ error: 'Module not found' });
          return;
        }
        
        // Create a new array with the updated module
        const updatedModules = [...modules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          isExpanded: !updatedModules[moduleIndex].isExpanded
        };
        
        set({ 
          orbitalModules: updatedModules,
          error: null
        });
      },
      
      // Toggle visibility of an orbital module
      toggleOrbitalModuleVisibility: (moduleId: string, isVisible: boolean) => {
        set(state => ({ 
          orbitalModules: state.orbitalModules.map(module => 
            module.id === moduleId 
              ? { ...module, isVisible } 
              : module
          ),
          error: null
        }));
        
        // Save layout memory
        const state = get();
        if (state.profile?.id) {
          state.saveLayoutMemory(state.profile.id);
        }
      },
      
      // Save current layout to memory
      saveLayoutMemory: (userId: string) => {
        const modules = get().orbitalModules;
        const currentLayouts = get().layoutMemory;
        
        // Create module layout map
        const moduleLayouts: {[key: string]: ModuleLayout} = {};
        modules.forEach(module => {
          moduleLayouts[module.id] = {
            position: module.position,
            orbitRing: module.orbitRing,
            orbitAngle: module.orbitAngle,
            isVisible: module.isVisible
          };
        });
        
        // Check if we already have a layout for this user
        const existingLayoutIndex = currentLayouts.findIndex(layout => layout.userId === userId);
        
        if (existingLayoutIndex >= 0) {
          // Update existing layout
          const updatedLayouts = [...currentLayouts];
          updatedLayouts[existingLayoutIndex] = {
            userId,
            moduleLayouts,
            lastUpdated: Date.now()
          };
          
          set({ layoutMemory: updatedLayouts });
        } else {
          // Add new layout
          set(state => ({
            layoutMemory: [
              ...state.layoutMemory,
              {
                userId,
                moduleLayouts,
                lastUpdated: Date.now()
              }
            ]
          }));
        }
      },
      
      // Load layout from memory
      loadLayoutMemory: (userId: string) => {
        const currentLayouts = get().layoutMemory;
        const savedLayout = currentLayouts.find(layout => layout.userId === userId);
        
        if (!savedLayout) return;
        
        // Apply saved layout to modules
        set(state => ({
          orbitalModules: state.orbitalModules.map(module => {
            const savedModule = savedLayout.moduleLayouts[module.id];
            
            if (savedModule) {
              return {
                ...module,
                position: savedModule.position,
                orbitRing: savedModule.orbitRing,
                orbitAngle: savedModule.orbitAngle,
                isVisible: savedModule.isVisible !== undefined ? savedModule.isVisible : true
              };
            }
            
            return module;
          })
        }));
      },
      
      // Set performance mode
      setPerformanceMode: (mode: 'high' | 'medium' | 'low') => {
        set({ performanceMode: mode });
      },
      
      // Reset the entire state
      resetState: () => {
        set({ 
          profile: null,
          orbitalModules: [],
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'eonid-store',
      partialize: (state) => ({
        profile: state.profile,
        orbitalModules: state.orbitalModules,
        layoutMemory: state.layoutMemory,
        performanceMode: state.performanceMode
      })
    }
  )
);

// Helper functions for mock data
const getMockOrbitalModules = (): OrbitalModule[] => ([
  {
    id: 'module-1',
    type: 'tokenHoldings',
    title: 'Token Holdings',
    subtitle: '2 Tokens',
    position: { x: -150, y: 0 },
    data: {
      tokens: [
        { symbol: 'EONIC', amount: 1250, value: 3750 },
        { symbol: 'SOL', amount: 5.2, value: 520 }
      ]
    }
  },
  {
    id: 'module-2',
    type: 'timepiece',
    title: 'Timepiece',
    subtitle: 'Level 3',
    position: { x: 150, y: -100 },
    data: {
      level: 3,
      xp: 2750,
      nextLevel: 5000,
      achievements: ['Early Adopter', 'Content Creator']
    }
  },
  {
    id: 'module-3',
    type: 'socialLinks',
    title: 'Social Links',
    subtitle: '2 Links',
    position: { x: 150, y: 100 },
    data: {
      links: [
        { platform: 'Twitter', url: 'https://twitter.com/buoyant' },
        { platform: 'GitHub', url: 'https://github.com/buoyant' },
        { platform: 'Discord', url: 'buoyant#1234' }
      ]
    }
  },
  {
    id: 'module-4',
    type: 'reputation',
    title: 'Reputation',
    subtitle: 'Score: 87',
    position: { x: 0, y: 200 },
    data: {
      score: 87,
      badges: ['Trusted', 'Contributor', 'Innovator'],
      endorsements: 12
    }
  }
]); 