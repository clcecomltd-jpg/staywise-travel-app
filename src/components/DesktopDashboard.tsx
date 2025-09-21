import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, Settings, Info, Plus, Grid3X3 } from 'lucide-react';
import DesktopWindow from './DesktopWindow';
import StayWisePreviewCard from './StayWisePreviewCard';
import DesktopSidebar from './DesktopSidebar';

type WindowSize = 'mobile' | 'tablet' | 'desktop';

interface WindowSizeConfig {
  width: number;
  height: number;
}

// Responsive window sizes based on screen dimensions
const getResponsiveWindowSizes = (): Record<WindowSize, WindowSizeConfig> => {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      mobile: { width: 430, height: 932 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1200, height: 800 }
    };
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const maxWidth = screenWidth * 0.9; // Never exceed 90% of screen width
  const maxHeight = (screenHeight - 64) * 0.9; // Account for toolbar and padding

  return {
    mobile: { 
      width: Math.min(430, maxWidth), 
      height: Math.min(932, maxHeight) 
    },
    tablet: { 
      width: Math.min(768, maxWidth), 
      height: Math.min(1024, maxHeight) 
    },
    desktop: { 
      width: Math.min(1200, maxWidth), 
      height: Math.min(800, maxHeight) 
    }
  };
};

interface AppWindow {
  id: string;
  title: string;
  size: WindowSize;
  isMinimized: boolean;
  isCollapsed: boolean;
  zIndex: number;
}

interface DesktopDashboardProps {
  onLaunchStayWise?: () => void;
  onNavigateToHome?: () => void;
}

const DesktopDashboard: React.FC<DesktopDashboardProps> = ({ onLaunchStayWise, onNavigateToHome }) => {
  const [windows, setWindows] = useState<AppWindow[]>([
    {
      id: 'staywise-main',
      title: 'StayWise - Travel Guide App',
      size: 'mobile',
      isMinimized: false,
      isCollapsed: false,
      zIndex: 1000
    }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string>('staywise-main');
  const [showGrid, setShowGrid] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(1001);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getWindowConfig = (size: WindowSize) => getResponsiveWindowSizes()[size];

  // Calculate optimal window position with responsive design and sidebar
  const calculateWindowPosition = (windowIndex: number, windowSize: WindowSize, isCollapsed: boolean = false) => {
    const config = getWindowConfig(windowSize);
    
    // Use smaller dimensions for collapsed windows
    const effectiveWidth = isCollapsed ? 320 : config.width;
    const effectiveHeight = isCollapsed ? 80 : config.height;
    
    // Get actual screen dimensions (fallback for SSR)
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    // Account for sidebar width - sidebar is always visible
    const sidebarWidth = 288; // Default expanded width (72 = w-72 in Tailwind)
    const availableWidth = screenWidth - sidebarWidth;
    
    // Responsive padding based on screen size
    const padding = screenWidth < 1024 ? 20 : screenWidth < 1440 ? 30 : 40;
    const toolbarHeight = 64;
    const cascade = screenWidth < 1024 ? 20 : 30; // Smaller cascade on smaller screens
    
    // For right-hand side positioning with responsive behavior
    let baseX, baseY;
    
    if (screenWidth < 1024) {
      // On smaller screens, center the window
      baseX = sidebarWidth + (availableWidth - effectiveWidth) / 2;
      baseY = toolbarHeight + padding;
    } else {
      // On larger screens, position on right-hand side
      baseX = screenWidth - effectiveWidth - padding;
      baseY = toolbarHeight + padding;
    }
    
    // Smart cascade that adapts to screen size
    const maxCascadeSteps = Math.floor((availableWidth - effectiveWidth - padding * 2) / cascade);
    const cascadeX = Math.min(windowIndex * cascade, maxCascadeSteps * cascade);
    const cascadeY = Math.min(windowIndex * cascade, cascade * 3); // Limit vertical cascade
    
    const x = baseX - cascadeX;
    const y = baseY + cascadeY;
    
    // Ensure window stays fully visible with intelligent bounds
    const maxX = screenWidth - effectiveWidth - 10; // Small margin to prevent cut-off
    const maxY = screenHeight - effectiveHeight - 10;
    const minX = sidebarWidth + 10; // Start after sidebar
    const minY = toolbarHeight + 10;
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  };

  const handleWindowSizeChange = (windowId: string, newSize: WindowSize) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, size: newSize } : window
    ));
  };

  const handleWindowClose = (windowId: string) => {
    setWindows(prev => prev.filter(window => window.id !== windowId));
    if (activeWindowId === windowId) {
      const remainingWindows = windows.filter(w => w.id !== windowId);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[0].id : '');
    }
  };

  const handleWindowMinimize = (windowId: string) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, isMinimized: true } : window
    ));
  };

  const handleWindowFocus = (windowId: string) => {
    setActiveWindowId(windowId);
    setWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, zIndex: nextZIndex, isMinimized: false } : window
    ));
    setNextZIndex(prev => prev + 1);
  };

  const handleWindowCollapse = (windowId: string, collapsed: boolean) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId ? { ...window, isCollapsed: collapsed } : window
    ));
  };

  const createNewWindow = () => {
    const newId = `staywise-${Date.now()}`;
    
    // Choose optimal initial window size based on screen dimensions
    let initialSize: WindowSize = 'mobile';
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1440) {
        initialSize = 'desktop';
      } else if (screenWidth >= 1024) {
        initialSize = 'tablet';
      } else {
        initialSize = 'mobile';
      }
    }
    
    const newWindow: AppWindow = {
      id: newId,
      title: `StayWise - Travel Guide App ${windows.length + 1}`,
      size: initialSize,
      isMinimized: false,
      isCollapsed: false,
      zIndex: nextZIndex
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newId);
    setNextZIndex(prev => prev + 1);
  };

  const restoreWindow = (windowId: string) => {
    handleWindowFocus(windowId);
  };

  // Handle window resize events to maintain proper positioning and sizing
  useEffect(() => {
    const handleResize = () => {
      // Recalculate window positions and sizes on screen resize
      setWindows(prev => prev.map((window, index) => {
        const newConfig = getWindowConfig(window.size);
        const newPosition = calculateWindowPosition(index, window.size, window.isCollapsed);
        
        return {
          ...window,
          // Force re-render with new responsive calculations
          lastResize: Date.now() // Timestamp to force re-render
        };
      }));
    };

    // Throttle resize events for better performance
    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Desktop Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.02) 50%, transparent 60%)
          `
        }} />
      </div>

      {/* Grid Overlay */}
      {showGrid && (
        <div className="desktop-grid-overlay visible" />
      )}

      {/* Desktop Sidebar */}
      <DesktopSidebar
        onCreateNewWindow={createNewWindow}
        onLaunchStayWise={onLaunchStayWise}
        onNavigateToHome={onNavigateToHome}
        onToggleGrid={() => setShowGrid(!showGrid)}
        isGridVisible={showGrid}
      />

      {/* Desktop Toolbar */}
      <div className="desktop-toolbar fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Welcome to your dashboard, Callum</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
            <button
              onClick={createNewWindow}
              className="p-2 rounded-lg text-white/60 hover:text-white/90 transition-colors"
              title="New Window"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-white/60 hover:text-white/90 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-white/60 hover:text-white/90 transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Windows */}
      {windows.map((window, index) => {
        if (window.isMinimized) return null;
        
        const config = getWindowConfig(window.size);
        const position = calculateWindowPosition(index, window.size, window.isCollapsed);
        
        return (
          <DesktopWindow
            key={window.id}
            title={window.title}
            initialPosition={position}
            initialSize={config}
            minSize={{ width: 320, height: 500 }}
            maxSize={{ width: 1400, height: 1000 }}
            onClose={() => handleWindowClose(window.id)}
            onMinimize={() => handleWindowMinimize(window.id)}
            onFocus={() => handleWindowFocus(window.id)}
            onCollapse={(collapsed) => handleWindowCollapse(window.id, collapsed)}
            isActive={activeWindowId === window.id}
            zIndex={window.zIndex}
            icon={<Smartphone className="w-4 h-4 text-blue-400" />}
            contentClassName="staywise-preview-container"
          >
            {/* Launch Indicator - Only show when not collapsed */}
            {!window.isCollapsed && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-white/80">Ready to Launch</span>
              </div>
            )}

            {/* StayWise Preview Card */}
            <div className="w-full h-full">
              <StayWisePreviewCard onLaunch={() => onLaunchStayWise?.()} />
            </div>
          </DesktopWindow>
        );
      })}

      {/* Taskbar for Minimized Windows */}
      {windows.some(w => w.isMinimized) && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3">
          {windows.filter(w => w.isMinimized).map((window) => (
            <button
              key={window.id}
              onClick={() => restoreWindow(window.id)}
              className="glass-card p-3 rounded-xl hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                  <Smartphone className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80">{window.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Desktop Status Panel */}
      <div className="fixed bottom-4 right-4 desktop-status-panel p-3 rounded-xl z-20">
        <div className="text-xs text-white/70 space-y-1">
          <div>Windows: {windows.filter(w => !w.isMinimized).length}</div>
          <div>Collapsed: {windows.filter(w => w.isCollapsed).length}</div>
          <div>Active: {activeWindowId ? windows.find(w => w.id === activeWindowId)?.title : 'None'}</div>
          <div>Grid: {showGrid ? 'On' : 'Off'}</div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboard;