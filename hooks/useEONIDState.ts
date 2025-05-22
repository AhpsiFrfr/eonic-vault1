import { useState, useCallback } from 'react';

interface OrbitalModule {
  id: string;
  type: string;
  title: string;
  data: any;
  position: { angle: number; distance: number };
}

export const useEONIDState = (initialModules: Array<any>) => {
  // Transform initial modules to include position if not provided
  const modulesWithPositions = initialModules.map((module, index) => ({
    ...module,
    position: module.position || {
      angle: (index * (360 / initialModules.length)) % 360,
      distance: 1 // Will be scaled based on container size
    }
  }));
  
  const [orbitalModules, setOrbitalModules] = useState<OrbitalModule[]>(modulesWithPositions);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  // Update module position (for drag and drop)
  const updateModulePosition = useCallback((id: string, position: { angle: number; distance: number }) => {
    setOrbitalModules(prev => 
      prev.map(module => 
        module.id === id ? { ...module, position } : module
      )
    );
  }, []);
  
  // Add new module
  const addModule = useCallback((moduleType: string, title: string, data: any) => {
    const newModule = {
      id: `module-${Date.now()}`,
      type: moduleType,
      title,
      data,
      position: {
        angle: Math.random() * 360,
        distance: 1
      }
    };
    
    setOrbitalModules(prev => [...prev, newModule]);
  }, []);
  
  // Remove module
  const removeModule = useCallback((id: string) => {
    setOrbitalModules(prev => prev.filter(module => module.id !== id));
    if (activeModule === id) {
      setActiveModule(null);
    }
  }, [activeModule]);
  
  return {
    orbitalModules,
    activeModule,
    setActiveModule,
    updateModulePosition,
    addModule,
    removeModule
  };
}; 