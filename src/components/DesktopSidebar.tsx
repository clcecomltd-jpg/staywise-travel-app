import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Smartphone, 
  Settings, 
  Info, 
  Grid3X3,
  Compass,
  Star,
  Users,
  BarChart3,
  MessageSquare,
  Bookmark,
  MapPin,
  Wifi,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { StayWiseLogo } from './ui/staywise-logo';

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items?: SidebarItem[];
  action?: () => void;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

interface DesktopSidebarProps {
  onCreateNewWindow?: () => void;
  onLaunchStayWise?: () => void;
  onNavigateToHome?: () => void;
  onToggleGrid?: () => void;
  isGridVisible?: boolean;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onCreateNewWindow,
  onLaunchStayWise,
  onNavigateToHome,
  onToggleGrid,
  isGridVisible = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sidebarSections: SidebarSection[] = [
    {
      id: 'home',
      title: 'Home',
      icon: <Home className="w-5 h-5" />,
      action: () => onNavigateToHome?.()
    },
    {
      id: 'workspace',
      title: 'Workspace',
      icon: <Grid3X3 className="w-5 h-5" />,
      items: [
        {
          id: 'new-window',
          title: 'New Window',
          icon: <Smartphone className="w-4 h-4" />,
          action: () => onCreateNewWindow?.(),
          badge: '⌘N'
        },
        {
          id: 'toggle-grid',
          title: 'Toggle Grid',
          icon: <Grid3X3 className="w-4 h-4" />,
          action: () => onToggleGrid?.(),
          badge: '⌘G'
        }
      ]
    },
    {
      id: 'staywise-apps',
      title: 'StayWise Apps',
      icon: <Compass className="w-5 h-5" />,
      items: [
        {
          id: 'launch-app',
          title: 'Launch StayWise',
          icon: <Smartphone className="w-4 h-4" />,
          action: () => onLaunchStayWise?.()
        },
        {
          id: 'guest-mode',
          title: 'Guest Mode',
          icon: <Users className="w-4 h-4" />,
          action: () => console.log('Guest mode')
        },
        {
          id: 'host-mode',
          title: 'Host Mode',
          icon: <Star className="w-4 h-4" />,
          action: () => console.log('Host mode'),
          badge: 'Pro'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: <MapPin className="w-5 h-5" />,
      items: [
        {
          id: 'explore',
          title: 'Explore',
          icon: <Compass className="w-4 h-4" />,
          action: () => console.log('Explore')
        },
        {
          id: 'favorites',
          title: 'Favorites',
          icon: <Bookmark className="w-4 h-4" />,
          action: () => console.log('Favorites')
        },
        {
          id: 'messages',
          title: 'Messages',
          icon: <MessageSquare className="w-4 h-4" />,
          action: () => console.log('Messages'),
          badge: '3'
        },
        {
          id: 'wifi',
          title: 'WiFi Info',
          icon: <Wifi className="w-4 h-4" />,
          action: () => console.log('WiFi')
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          icon: <Home className="w-4 h-4" />,
          action: () => console.log('Dashboard')
        },
        {
          id: 'insights',
          title: 'Insights',
          icon: <BarChart3 className="w-4 h-4" />,
          action: () => console.log('Insights')
        },
        {
          id: 'calendar',
          title: 'Calendar',
          icon: <Calendar className="w-4 h-4" />,
          action: () => console.log('Calendar')
        }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      action: () => console.log('Settings')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      action: () => console.log('Help')
    }
  ];

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const handleItemClick = (item: SidebarItem) => {
    item.action();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
      
      // Cmd/Ctrl + N to create new window
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        onCreateNewWindow?.();
      }
      
      // Cmd/Ctrl + G to toggle grid
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        onToggleGrid?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed, onCreateNewWindow, onToggleGrid]);

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 sidebar-collapse-transition ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      {/* Sidebar Container */}
      <div className="h-full desktop-sidebar rounded-r-2xl border-l-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <StayWiseLogo variant="icon" size="sm" />
              <div>
                <h3 className="font-medium text-white/90">StayWise</h3>
                <p className="text-xs text-white/60">Desktop</p>
              </div>
            </div>
          )}
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/10 transition-all duration-200"
            title={`${isCollapsed ? 'Expand' : 'Collapse'} Sidebar (⌘B)`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto sidebar-scroll p-2 space-y-2">
          {sidebarSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => section.items ? toggleSection(section.id) : section.action?.()}
                className={`sidebar-item w-full flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white/95 hover:bg-white/10 transition-all duration-200 group relative ${
                  expandedSection === section.id && section.items ? 'bg-white/5' : ''
                }`}
                title={isCollapsed ? section.title : undefined}
              >
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="sidebar-tooltip">
                    {section.title}
                  </div>
                )}
                <div className="flex-shrink-0">
                  {section.icon}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="font-medium text-sm flex-1 text-left">
                      {section.title}
                    </span>
                    
                    {section.items && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedSection === section.id ? 'rotate-90' : ''
                        }`} 
                      />
                    )}
                  </>
                )}
              </button>

              {/* Section Items */}
              {section.items && expandedSection === section.id && !isCollapsed && (
                <div className="ml-4 space-y-1 sidebar-section-enter-active">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="sidebar-item w-full flex items-center gap-3 p-2 rounded-lg text-white/70 hover:text-white/90 hover:bg-white/10 transition-all duration-200 group relative"
                    >
                      <div className="flex-shrink-0 text-white/60 group-hover:text-white/80">
                        {item.icon}
                      </div>
                      
                      <span className="text-sm flex-1 text-left">
                        {item.title}
                      </span>
                      
                      {item.badge && (
                        <div className={`sidebar-badge px-2 py-1 rounded-full ${
                          item.id === 'messages' ? 'notification' : 
                          item.badge.includes('⌘') ? 'opacity-60' : ''
                        }`}>
                          <span className={`text-xs font-medium text-white/90 ${
                            item.badge.includes('⌘') ? 'font-mono' : ''
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {!isCollapsed ? (
            <div className="glass-float p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <StayWiseLogo variant="icon" size="sm" className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/90">Connected</p>
                  <p className="text-xs text-white/60">Desktop Mode</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 sidebar-status-connected" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400 sidebar-status-connected" />
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div 
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize sidebar-resize-handle"
          title="Resize Sidebar"
        />
      )}
    </div>
  );
};

export default DesktopSidebar;