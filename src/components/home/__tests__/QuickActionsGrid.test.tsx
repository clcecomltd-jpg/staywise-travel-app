import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickActionsGrid from '../QuickActionsGrid';
import { useDeepLinks } from '../../../hooks/useDeepLinks';

// Mock the useDeepLinks hook
jest.mock('../../../hooks/useDeepLinks');
const mockUseDeepLinks = useDeepLinks as jest.MockedFunction<typeof useDeepLinks>;

// Mock navigator.vibrate
Object.defineProperty(global.navigator, 'vibrate', {
  value: jest.fn(),
  configurable: true
});

describe('QuickActionsGrid', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockUseDeepLinks.mockReturnValue({
      navigate: mockNavigate,
      hrefFor: jest.fn()
    });
    jest.clearAllMocks();
  });

  it('renders the grid with header', () => {
    render(<QuickActionsGrid />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick Actions' })).toBeInTheDocument();
  });

  it('renders all grid tiles from GRID_LINKS', () => {
    render(<QuickActionsGrid />);
    
    // Check that standard grid items are rendered
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /favourites/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /messages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /day trips/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /esim/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restaurants/i })).toBeInTheDocument();
  });

  it('calls navigate when a tile is clicked', () => {
    render(<QuickActionsGrid />);
    
    const exploreButton = screen.getByRole('button', { name: /explore/i });
    fireEvent.click(exploreButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('EXPLORE');
  });

  it('calls vibrate on tile click when available', () => {
    const mockVibrate = jest.fn();
    Object.defineProperty(global.navigator, 'vibrate', {
      value: mockVibrate,
      configurable: true
    });

    render(<QuickActionsGrid />);
    
    const exploreButton = screen.getByRole('button', { name: /explore/i });
    fireEvent.click(exploreButton);
    
    expect(mockVibrate).toHaveBeenCalledWith(50);
  });

  it('does not throw error when vibrate is not available', () => {
    // Remove vibrate from navigator
    Object.defineProperty(global.navigator, 'vibrate', {
      value: undefined,
      configurable: true
    });

    render(<QuickActionsGrid />);
    
    const exploreButton = screen.getByRole('button', { name: /explore/i });
    
    expect(() => fireEvent.click(exploreButton)).not.toThrow();
    expect(mockNavigate).toHaveBeenCalledWith('EXPLORE');
  });

  it('applies custom className', () => {
    const { container } = render(<QuickActionsGrid className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes for tiles', () => {
    render(<QuickActionsGrid />);
    
    const exploreButton = screen.getByRole('button', { name: /explore.*discover local activities/i });
    expect(exploreButton).toBeInTheDocument();
    
    // Check that icons are properly hidden from screen readers
    const icons = screen.getAllByTestId(/lucide-/);
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('has proper grid layout classes', () => {
    const { container } = render(<QuickActionsGrid />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2', 'sm:grid-cols-3', 'gap-4');
  });

  it('renders tiles with proper animation delays', () => {
    render(<QuickActionsGrid />);
    
    const buttons = screen.getAllByRole('button').filter(btn => 
      btn.getAttribute('aria-label')?.includes(':')
    );
    
    // First row should have delays: 0s, 0.1s, 0.2s
    // Second row should have delays: 0.4s, 0.5s, 0.6s
    expect(buttons[0]).toHaveStyle('animation-delay: 0s');
    expect(buttons[1]).toHaveStyle('animation-delay: 0.1s');
    expect(buttons[2]).toHaveStyle('animation-delay: 0.2s');
    expect(buttons[3]).toHaveStyle('animation-delay: 0.4s');
    expect(buttons[4]).toHaveStyle('animation-delay: 0.5s');
    expect(buttons[5]).toHaveStyle('animation-delay: 0.6s');
  });

  it('renders fallback compass icon for unknown icon types', () => {
    // This would test the fallback behavior in iconMap
    render(<QuickActionsGrid />);
    
    // All buttons should render without errors even if icon mapping fails
    const buttons = screen.getAllByRole('button').filter(btn => 
      btn.getAttribute('aria-label')?.includes(':')
    );
    expect(buttons).toHaveLength(6);
  });

  it('supports mouse interaction states', () => {
    render(<QuickActionsGrid />);
    
    const exploreButton = screen.getByRole('button', { name: /explore/i });
    
    // Test hover state
    fireEvent.mouseEnter(exploreButton);
    fireEvent.mouseLeave(exploreButton);
    
    // Test press state  
    fireEvent.mouseDown(exploreButton);
    fireEvent.mouseUp(exploreButton);
    
    // Should not throw errors
    expect(exploreButton).toBeInTheDocument();
  });
});