import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Minimize2, Maximize2, X, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { StayWiseLogo } from './ui/staywise-logo';

interface DesktopWindowProps {
  title: string;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
  isActive?: boolean;
  zIndex?: number;
}

const DesktopWindow: React.FC<DesktopWindowProps> = ({
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 },
  minSize = { width: 320, height: 200 },
  maxSize = { width: 1400, height: 1000 },
  resizable = true,
  draggable = true,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onCollapse,
  className = '',
  headerClassName = '',
  contentClassName = '',
  icon,
  isActive = true,
  zIndex = 1000
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const originalSize = useRef(initialSize);
  const originalPosition = useRef(initialPosition);
  const preCollapseSize = useRef(initialSize);

  // Handle window dragging - Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;
    
    e.preventDefault();
    setIsDragging(true);
    onFocus?.();

    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle window dragging - Touch events for mobile responsiveness
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!draggable || isMaximized || e.touches.length !== 1) return;
    
    e.preventDefault();
    setIsDragging(true);
    onFocus?.();

    const touch = e.touches[0];
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent | Touch) => {
    if (isDragging && !isMaximized) {
      // Minimal constraints for fully draggable experience
      const minPadding = 10; // Just enough to prevent complete disappearance
      const toolbarHeight = 64;
      
      // Allow dragging with minimal constraints - window can go mostly off-screen
      const maxX = window.innerWidth - minPadding;
      const minX = -size.width + minPadding;
      const maxY = window.innerHeight - minPadding;
      const minY = toolbarHeight;
      
      const clientX = 'clientX' in e ? e.clientX : e.clientX;
      const clientY = 'clientY' in e ? e.clientY : e.clientY;
      
      const newX = Math.max(minX, Math.min(maxX, clientX - dragOffset.x));
      const newY = Math.max(minY, Math.min(maxY, clientY - dragOffset.y));
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && !isMaximized && e.touches.length === 1) {
      e.preventDefault();
      handleMouseMove(e.touches[0]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle window resizing
  const handleResize = (direction: string, e: React.MouseEvent) => {
    if (!resizable || isMaximized || isCollapsed) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onFocus?.();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleMouseMoveResize = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('right')) {
        newWidth = Math.max(minSize.width, Math.min(maxSize.width, startWidth + deltaX));
      }
      if (direction.includes('left')) {
        newWidth = Math.max(minSize.width, Math.min(maxSize.width, startWidth - deltaX));
        newX = startPosX + (startWidth - newWidth);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(minSize.height, Math.min(maxSize.height, startHeight + deltaY));
      }
      if (direction.includes('top')) {
        newHeight = Math.max(minSize.height, Math.min(maxSize.height, startHeight - deltaY));
        newY = startPosY + (startHeight - newHeight);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUpResize = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMoveResize);
      document.removeEventListener('mouseup', handleMouseUpResize);
    };

    document.addEventListener('mousemove', handleMouseMoveResize);
    document.addEventListener('mouseup', handleMouseUpResize);
  };

  // Handle maximize/restore
  const handleMaximize = () => {
    if (isMaximized) {
      // Restore
      setPosition(originalPosition.current);
      setSize(originalSize.current);
      setIsMaximized(false);
    } else {
      // Maximize
      originalPosition.current = position;
      originalSize.current = size;
      setPosition({ x: 0, y: 64 }); // Account for toolbar
      setSize({ width: window.innerWidth, height: window.innerHeight - 64 });
      setIsMaximized(true);
    }
    onMaximize?.();
  };

  const handleMinimize = () => {
    onMinimize?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  // Handle collapse/expand
  const handleCollapse = () => {
    if (isCollapsed) {
      // Expand - restore to previous size
      setSize(preCollapseSize.current);
      setIsCollapsed(false);
    } else {
      // Collapse - save current size and set to compact rectangle
      preCollapseSize.current = size;
      setSize({ width: 320, height: 80 }); // Compact rectangle size
      setIsCollapsed(true);
    }
    onCollapse?.(!isCollapsed);
  };

  const handleWindowClick = () => {
    onFocus?.();
  };

  useEffect(() => {
    if (isDragging) {
      let animationId: number;
      let lastEvent: MouseEvent | Touch;
      
      // Ultra-smooth dragging with RAF batching for both mouse and touch
      const handleMoveRAF = (e: MouseEvent | TouchEvent) => {
        const event = 'touches' in e ? e.touches[0] : e;
        lastEvent = event;
        if (animationId) return; // Already scheduled
        
        animationId = requestAnimationFrame(() => {
          handleMouseMove(lastEvent);
          animationId = 0;
        });
      };
      
      const handleEndRAF = () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = 0;
        }
        handleMouseUp();
      };
      
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMoveRAF, { passive: true });
      document.addEventListener('mouseup', handleEndRAF, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEndRAF, { passive: true });
      
      // Prevent text selection and context menus during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMoveRAF);
        document.removeEventListener('mouseup', handleEndRAF);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEndRAF);
        
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        
        // Restore interactions
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isDragging, dragOffset, size.width, size.height]);

  useEffect(() => {
    // Update original size when not maximized or collapsed
    if (!isMaximized && !isCollapsed) {
      originalSize.current = size;
      originalPosition.current = position;
    }
  }, [size, position, isMaximized, isCollapsed]);

  return (
    <div
      ref={windowRef}
      className={`absolute glass-card rounded-2xl overflow-hidden shadow-2xl window-collapse-transition ${
        isActive ? 'window-focused' : 'window-unfocused'
      } ${isDragging ? 'window-dragging cursor-grabbing select-none' : ''} ${
        isCollapsed ? 'window-collapsed' : ''
      } ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={handleWindowClick}
    >
      {/* Window Header */}
      <div
        ref={headerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`glass-header h-12 flex items-center justify-between px-4 border-b border-white/10 ${
          draggable && !isMaximized ? 'cursor-grab touch-none' : 'cursor-default'
        } ${isDragging ? 'cursor-grabbing' : ''} ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="window-control close hover:brightness-110"
              title="Close"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
              className="window-control minimize hover:brightness-110"
              title="Minimize"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMaximize();
              }}
              className="window-control maximize hover:brightness-110"
              title={isMaximized ? 'Restore' : 'Maximize'}
            />
          </div>

          {/* Window Title */}
          <div className="flex items-center gap-2">
            {icon && <div className="w-4 h-4">{icon}</div>}
            <span className="text-sm font-medium text-white/90 select-none">{title}</span>
          </div>
        </div>

        {/* Collapse/Expand Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCollapse();
            }}
            className="collapse-button p-1 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/10 transition-all duration-200"
            title={isCollapsed ? 'Expand Window' : 'Collapse to Icon'}
          >
            <ChevronDown 
              className={`w-4 h-4 chevron-transition ${
                isCollapsed ? 'chevron-collapsed' : 'chevron-expanded'
              }`} 
            />
          </button>
          
          {/* Drag Handle */}
          {draggable && !isMaximized && (
            <div className="text-white/40">
              <Move className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Window Content */}
      {isCollapsed ? (
        /* Collapsed Content - StayWise Icon and Text Only */
        <div className="flex items-center justify-center h-8 px-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-lg collapsed-content-enter-active">
          <StayWiseLogo variant="icon" size="sm" className="scale-75" />
          <span className="ml-2 text-sm font-medium text-white/90 tracking-wide">StayWise</span>
        </div>
      ) : (
        /* Expanded Content */
        <div 
          className={`relative overflow-hidden ${contentClassName}`}
          style={{ height: size.height - 48 }}
        >
          {children}
        </div>
      )}

      {/* Resize Handles */}
      {resizable && !isMaximized && !isCollapsed && (
        <>
          {/* Edges */}
          <div
            className="resize-handle edge-right"
            onMouseDown={(e) => handleResize('right', e)}
          />
          <div
            className="resize-handle edge-bottom"
            onMouseDown={(e) => handleResize('bottom', e)}
          />
          <div
            className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
            onMouseDown={(e) => handleResize('top', e)}
          />
          <div
            className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
            onMouseDown={(e) => handleResize('left', e)}
          />

          {/* Corners */}
          <div
            className="resize-handle corner corner-br"
            onMouseDown={(e) => handleResize('bottom-right', e)}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResize('top-right', e)}
          />
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResize('top-left', e)}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResize('bottom-left', e)}
          />
        </>
      )}
    </div>
  );
};

export default DesktopWindow;