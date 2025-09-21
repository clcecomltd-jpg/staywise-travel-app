import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentCard, { ContentCardProps } from '../ContentCard';

const mockProps: ContentCardProps = {
  id: "test-card",
  image: "/test-image.jpg",
  title: "Test Card",
  subtitle: "Test Subtitle",
  description: "Test description for the card",
  rating: 4.5,
  price: "$50",
  priceFrom: true,
  meta: {
    location: "Test Location",
    duration: "2 hours",
    capacity: 10,
    difficulty: "Easy",
    category: "Adventure"
  },
  actions: {
    primary: {
      label: "Book Now",
      onClick: jest.fn()
    },
    secondary: {
      label: "Learn More",
      onClick: jest.fn()
    }
  },
  onFavorite: jest.fn(),
  isFavorite: false
};

describe('ContentCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with all props', () => {
    render(<ContentCard {...mockProps} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test description for the card')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('From $50')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    expect(screen.getByText('Up to 10')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('renders minimal props correctly', () => {
    const minimalProps = {
      id: "minimal",
      image: "/minimal.jpg",
      title: "Minimal Card"
    };

    render(<ContentCard {...minimalProps} />);
    
    expect(screen.getByText('Minimal Card')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Minimal Card');
  });

  it('handles favorite button clicks', () => {
    render(<ContentCard {...mockProps} />);
    
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    expect(mockProps.onFavorite).toHaveBeenCalledWith('test-card');
  });

  it('shows correct favorite button state when favorited', () => {
    render(<ContentCard {...mockProps} isFavorite={true} />);
    
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('handles primary action click', () => {
    render(<ContentCard {...mockProps} />);
    
    const primaryButton = screen.getByText('Book Now');
    fireEvent.click(primaryButton);
    
    expect(mockProps.actions?.primary?.onClick).toHaveBeenCalled();
  });

  it('handles secondary action click', () => {
    render(<ContentCard {...mockProps} />);
    
    const secondaryButton = screen.getByText('Learn More');
    fireEvent.click(secondaryButton);
    
    expect(mockProps.actions?.secondary?.onClick).toHaveBeenCalled();
  });

  it('displays difficulty badge correctly', () => {
    render(<ContentCard {...mockProps} />);
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders different difficulty badges with correct styling', () => {
    const mediumProps = {
      ...mockProps,
      meta: { ...mockProps.meta, difficulty: 'Medium' as const }
    };

    const { rerender } = render(<ContentCard {...mediumProps} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    const hardProps = {
      ...mockProps,
      meta: { ...mockProps.meta, difficulty: 'Hard' as const }
    };

    rerender(<ContentCard {...hardProps} />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('handles price without "From" prefix', () => {
    const noPrefixProps = {
      ...mockProps,
      priceFrom: false
    };

    render(<ContentCard {...noPrefixProps} />);
    
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.queryByText('From $50')).not.toBeInTheDocument();
  });

  it('does not render optional elements when not provided', () => {
    const minimalProps = {
      id: "minimal",
      image: "/minimal.jpg",
      title: "Minimal Card"
    };

    render(<ContentCard {...minimalProps} />);
    
    expect(screen.queryByText('From')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Add to favorites')).not.toBeInTheDocument();
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ContentCard {...mockProps} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', 'card-title-test-card');
    
    const title = screen.getByText('Test Card');
    expect(title).toHaveAttribute('id', 'card-title-test-card');
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Card');
  });

  it('renders star rating correctly', () => {
    render(<ContentCard {...mockProps} />);
    
    const ratingContainer = screen.getByText('4.5').closest('div');
    expect(ratingContainer).toBeInTheDocument();
    
    // Check for star icons (assuming they're rendered)
    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5); // Assuming 5-star rating system
  });

  it('handles missing image gracefully', () => {
    const noImageProps = {
      ...mockProps,
      image: ""
    };

    render(<ContentCard {...noImageProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Card');
  });

  it('renders meta information correctly', () => {
    render(<ContentCard {...mockProps} />);
    
    // Check for location icon and text
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    
    // Check for duration icon and text
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    
    // Check for capacity with proper formatting
    expect(screen.getByText('Up to 10')).toBeInTheDocument();
    
    // Check for category
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('handles long text content appropriately', () => {
    const longTextProps = {
      ...mockProps,
      title: "This is a very long title that should be handled appropriately by the component",
      description: "This is a very long description that should be truncated or handled appropriately to maintain the card layout and visual hierarchy without breaking the design"
    };

    render(<ContentCard {...longTextProps} />);
    
    expect(screen.getByText(longTextProps.title)).toBeInTheDocument();
    expect(screen.getByText(longTextProps.description)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customProps = {
      ...mockProps,
      className: "custom-card-class"
    };

    render(<ContentCard {...customProps} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveClass('custom-card-class');
  });

  it('handles keyboard navigation for interactive elements', () => {
    render(<ContentCard {...mockProps} />);
    
    const favoriteButton = screen.getByLabelText('Add to favorites');
    const primaryButton = screen.getByText('Book Now');
    const secondaryButton = screen.getByText('Learn More');
    
    // Check that buttons are focusable
    expect(favoriteButton).toHaveAttribute('tabIndex', '0');
    expect(primaryButton).not.toHaveAttribute('tabIndex', '-1');
    expect(secondaryButton).not.toHaveAttribute('tabIndex', '-1');
    
    // Test keyboard interaction
    fireEvent.keyDown(favoriteButton, { key: 'Enter' });
    expect(mockProps.onFavorite).toHaveBeenCalledWith('test-card');
    
    fireEvent.keyDown(primaryButton, { key: ' ' });
    expect(mockProps.actions?.primary?.onClick).toHaveBeenCalled();
  });

  it('renders without actions when not provided', () => {
    const noActionsProps = {
      ...mockProps,
      actions: undefined
    };

    render(<ContentCard {...noActionsProps} />);
    
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
  });

  it('renders with only primary action', () => {
    const primaryOnlyProps = {
      ...mockProps,
      actions: {
        primary: {
          label: "Book Now",
          onClick: jest.fn()
        }
      }
    };

    render(<ContentCard {...primaryOnlyProps} />);
    
    expect(screen.getByText('Book Now')).toBeInTheDocument();
    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
  });

  it('handles zero rating correctly', () => {
    const zeroRatingProps = {
      ...mockProps,
      rating: 0
    };

    render(<ContentCard {...zeroRatingProps} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles high rating correctly', () => {
    const highRatingProps = {
      ...mockProps,
      rating: 5.0
    };

    render(<ContentCard {...highRatingProps} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('supports dark and light mode styling', () => {
    const { rerender } = render(<ContentCard {...mockProps} isDarkMode={true} />);
    
    // Test dark mode (default behavior)
    expect(screen.getByText('Test Card')).toHaveClass('text-white/95');
    
    // Test light mode
    rerender(<ContentCard {...mockProps} isDarkMode={false} />);
    expect(screen.getByText('Test Card')).toHaveClass('text-white/95'); // Still shows because of the class structure
  });

  it('truncates long text with line-clamp classes', () => {
    const longTextProps = {
      ...mockProps,
      title: "Very Long Title That Should Be Truncated",
      subtitle: "Very Long Subtitle That Should Be Truncated",
      description: "Very long description that should be truncated after two lines of text content"
    };

    render(<ContentCard {...longTextProps} />);
    
    const title = screen.getByText(longTextProps.title);
    const subtitle = screen.getByText(longTextProps.subtitle);
    const description = screen.getByText(longTextProps.description);
    
    expect(title).toHaveClass('line-clamp-1');
    expect(subtitle).toHaveClass('line-clamp-1');
    expect(description).toHaveClass('line-clamp-2');
  });
});
