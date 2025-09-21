import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen: boolean;
  zIndex: number;
}

interface DesktopPreferences {
  theme: 'light' | 'dark' | 'auto';
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  defaultWindowSize: 'mobile' | 'tablet' | 'desktop';
  enableAnimations: boolean;
  showStatusPanel: boolean;
}

interface DesktopContextType {
  windows: WindowState[];
  preferences: DesktopPreferences;
  activeWindowId: string | null;
  
  // Window management
  createWindow: (config: Partial<WindowState>) => string;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  
  // Preferences
  updatePreferences: (updates: Partial<DesktopPreferences>) => void;
  
  // Utility functions
  getNextZIndex: () => number;
  getWindowById: (id: string) => WindowState | undefined;
}

const defaultPreferences: DesktopPreferences = {
  theme: 'dark',
  showGrid: false,
  snapToGrid: false,
  gridSize: 20,
  defaultWindowSize: 'mobile',
  enableAnimations: true,
  showStatusPanel: true
};

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};

interface DesktopProviderProps {
  children: ReactNode;
}

export const DesktopProvider: React.FC<DesktopProviderProps> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [preferences, setPreferences] = useState<DesktopPreferences>(defaultPreferences);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1000);

  const getNextZIndex = useCallback(() => {
    setNextZIndex(prev => prev + 1);
    return nextZIndex;
  }, [nextZIndex]);

  const createWindow = useCallback((config: Partial<WindowState>): string => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: WindowState = {
      id,
      title: 'New Window',
      position: { x: 100, y: 100 },
      size: { width: 430, height: 932 },
      isMinimized: false,
      isMaximized: false,
      isFullscreen: false,
      zIndex: getNextZIndex(),
      ...config
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
    return id;
  }, [getNextZIndex]);

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, ...updates } : window
    ));
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    updateWindow(id, { zIndex: getNextZIndex() });
  }, [getNextZIndex, updateWindow]);

  const minimizeWindow = useCallback((id: string) => {
    updateWindow(id, { isMinimized: true });
  }, [updateWindow]);

  const maximizeWindow = useCallback((id: string) => {
    const window = windows.find(w => w.id === id);
    if (window) {
      updateWindow(id, { 
        isMaximized: !window.isMaximized,
        position: window.isMaximized ? { x: 100, y: 100 } : { x: 0, y: 0 },
        size: window.isMaximized 
          ? { width: 430, height: 932 }
          : { width: window.innerWidth || 1200, height: (window.innerHeight || 800) - 64 }
      });
    }
  }, [windows, updateWindow]);

  const updatePreferences = useCallback((updates: Partial<DesktopPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const getWindowById = useCallback((id: string) => {
    return windows.find(window => window.id === id);
  }, [windows]);

  const value: DesktopContextType = {
    windows,
    preferences,
    activeWindowId,
    createWindow,
    updateWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updatePreferences,
    getNextZIndex,
    getWindowById
  };

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
};

export default DesktopContext;