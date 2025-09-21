import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityCard, { ActivityCardProps } from '../ActivityCard';

const mockProps: ActivityCardProps = {
  id: "activity-1",
  image: "/activity.jpg",
  title: "Mountain Hiking",
  duration: "4 hours",
  location: "National Park",
  capacity: 8,
  difficulty: "Medium",
  category: "Outdoor",
  price: "$50",
  rating: 4.8,
  onBook: jest.fn(),
  onViewDetails: jest.fn()
};

describe('ActivityCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<ActivityCard {...mockProps} />);
    
    expect(screen.getByText('Mountain Hiking')).toBeInTheDocument();
    expect(screen.getByText('4 hours')).toBeInTheDocument();
    expect(screen.getByText('National Park')).toBeInTheDocument();
    expect(screen.getByText('Up to 8')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Outdoor')).toBeInTheDocument();
    expect(screen.getByText('From $50')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('calls onBook when "Book Now" is clicked', () => {
    render(<ActivityCard {...mockProps} />);
    
    const bookButton = screen.getByText('Book Now');
    fireEvent.click(bookButton);
    
    expect(mockProps.onBook).toHaveBeenCalled();
  });

  it('calls onViewDetails when "Details" is clicked', () => {
    render(<ActivityCard {...mockProps} />);
    
    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    
    expect(mockProps.onViewDetails).toHaveBeenCalled();
  });

  it('does not render "Book Now" if onBook is not provided', () => {
    const { onBook, ...propsWithoutOnBook } = mockProps;
    render(<ActivityCard {...propsWithoutOnBook} />);
    
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
  });

  it('does not render "Details" if onViewDetails is not provided', () => {
    const { onViewDetails, ...propsWithoutOnViewDetails } = mockProps;
    render(<ActivityCard {...propsWithoutOnViewDetails} />);
    
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });

  it('passes props correctly to ContentCard', () => {
    render(<ActivityCard {...mockProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/activity.jpg');
    expect(image).toHaveAttribute('alt', 'Mountain Hiking');
  });

  it('displays correct difficulty badge', () => {
    render(<ActivityCard {...mockProps} />);
    
    const badge = screen.getByText('Medium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border-yellow-400/30');
  });

  it('renders without optional capacity and difficulty', () => {
    const { capacity, difficulty, ...props } = mockProps;
    render(<ActivityCard {...props} />);

    expect(screen.queryByText(/Up to/)).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
  });
});