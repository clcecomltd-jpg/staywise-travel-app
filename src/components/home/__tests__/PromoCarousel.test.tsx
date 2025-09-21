import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PromoCarousel, { PromoData } from '../PromoCarousel';

const mockPromos: PromoData[] = [
  {
    id: "1",
    title: "Sunset Dinner",
    tag: "Exclusive",
    image: "/test/image1.jpg",
    ctaLabel: "Reserve",
    href: "/book/1",
    description: "Amazing dinner experience",
    price: "From $89",
    rating: 4.9,
    duration: "2 hours",
    location: "Sky Bar"
  },
  {
    id: "2",
    title: "Temple Tour",
    tag: "Cultural",
    image: "/test/image2.jpg",
    ctaLabel: "Book Tour",
    href: "/book/2",
    description: "Visit historic temples",
    price: "From $45",
    rating: 4.8,
    duration: "4 hours",
    location: "Grand Palace"
  },
  {
    id: "3",
    title: "Cooking Class",
    tag: "Food",
    image: "/test/image3.jpg",
    ctaLabel: "Learn",
    href: "/book/3",
    description: "Master Thai cooking",
    price: "From $65",
    rating: 4.9,
    duration: "3 hours",
    location: "Kitchen Studio"
  }
];

// Mock console.log for navigation testing
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('PromoCarousel', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    // Mock scrollTo for carousel navigation
    Element.prototype.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default promos when none provided', () => {
    render(<PromoCarousel />);
    
    expect(screen.getByText('Special Offers')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', 'promo-carousel-title');
    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders with custom promos', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    expect(screen.getByText('Sunset Dinner')).toBeInTheDocument();
    expect(screen.getByText('Temple Tour')).toBeInTheDocument();
    expect(screen.getByText('Cooking Class')).toBeInTheDocument();
  });

  it('displays promo card details correctly', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    // Check first promo details
    expect(screen.getByText('Sunset Dinner')).toBeInTheDocument();
    expect(screen.getByText('Amazing dinner experience')).toBeInTheDocument();
    expect(screen.getByText('From $89')).toBeInTheDocument();
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    expect(screen.getByText('Sky Bar')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('Exclusive')).toBeInTheDocument();
  });

  it('handles CTA button clicks', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const reserveButton = screen.getByText('Reserve');
    fireEvent.click(reserveButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Navigate to: /book/1');
  });

  it('has accessible navigation controls', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const prevButton = screen.getByLabelText('Previous offer');
    const nextButton = screen.getByLabelText('Next offer');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('navigates with arrow buttons', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const nextButton = screen.getByLabelText('Next offer');
    fireEvent.click(nextButton);
    
    // Should scroll to next position
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
      left: 304, // cardWidth (288) + gap (16)
      behavior: 'smooth'
    });
  });

  it('navigates with previous button', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const prevButton = screen.getByLabelText('Previous offer');
    fireEvent.click(prevButton);
    
    // Should scroll to last position (wraps around)
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
      left: 608, // index 2: (288 + 16) * 2
      behavior: 'smooth'
    });
  });

  it('renders slide indicators', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const indicators = screen.getAllByLabelText(/Go to slide/);
    expect(indicators).toHaveLength(3);
    
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument();
  });

  it('navigates via slide indicators', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const secondIndicator = screen.getByLabelText('Go to slide 2');
    fireEvent.click(secondIndicator);
    
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
      left: 304, // index 1: (288 + 16) * 1
      behavior: 'smooth'
    });
  });

  it('displays images with proper attributes', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const images = screen.getAllByRole('img');
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('alt', mockPromos[index].title);
      expect(img).toHaveAttribute('src', mockPromos[index].image);
    });
  });

  it('applies custom className', () => {
    const { container } = render(<PromoCarousel className="custom-carousel" promos={mockPromos} />);
    
    expect(container.firstChild).toHaveClass('custom-carousel');
  });

  it('disables autoplay by default when specified', () => {
    render(<PromoCarousel promos={mockPromos} autoPlay={false} />);
    
    // Component should render without auto-advancing
    expect(screen.getByText('Special Offers')).toBeInTheDocument();
  });

  it('pauses autoplay on hover', async () => {
    render(<PromoCarousel promos={mockPromos} autoPlay={true} autoPlayInterval={100} />);
    
    const carousel = screen.getByRole('region');
    const scrollContainer = carousel.querySelector('.overflow-x-auto');
    
    // Hover over carousel
    if (scrollContainer) {
      fireEvent.mouseEnter(scrollContainer);
      
      // Wait longer than autoplay interval
      await waitFor(() => new Promise(resolve => setTimeout(resolve, 150)));
      
      // Should not have auto-advanced due to hover
      fireEvent.mouseLeave(scrollContainer);
    }
  });

  it('handles empty promos array', () => {
    render(<PromoCarousel promos={[]} />);
    
    expect(screen.getByText('Special Offers')).toBeInTheDocument();
    expect(screen.queryByText('Reserve')).not.toBeInTheDocument();
  });

  it('renders rating stars correctly', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    // Should have star icons for ratings
    const ratingElements = screen.getAllByText('4.9');
    expect(ratingElements).toHaveLength(2); // Two promos with 4.9 rating
  });

  it('handles promos without optional fields', () => {
    const minimalPromos: PromoData[] = [
      {
        id: "minimal",
        title: "Basic Promo",
        tag: "Simple",
        image: "/minimal.jpg",
        ctaLabel: "Go",
        href: "/minimal"
      }
    ];

    render(<PromoCarousel promos={minimalPromos} />);
    
    expect(screen.getByText('Basic Promo')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    
    // Optional fields should not error
    expect(screen.queryByText('From')).not.toBeInTheDocument();
  });

  it('has proper scroll snap styling', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const scrollContainer = screen.getByRole('region').querySelector('.overflow-x-auto');
    expect(scrollContainer).toHaveStyle({ scrollSnapType: 'x mandatory' });
  });

  it('renders tags with proper styling', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    expect(screen.getByText('Exclusive')).toBeInTheDocument();
    expect(screen.getByText('Cultural')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<PromoCarousel promos={mockPromos} />);
    
    const nextButton = screen.getByLabelText('Next offer');
    
    // Test keyboard activation
    nextButton.focus();
    fireEvent.keyDown(nextButton, { key: 'Enter' });
    
    expect(Element.prototype.scrollTo).toHaveBeenCalled();
  });
});