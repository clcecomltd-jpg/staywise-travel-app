import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestaurantCard, { RestaurantCardProps } from '../RestaurantCard';

const mockProps: RestaurantCardProps = {
  id: "restaurant-1",
  image: "/restaurant.jpg",
  title: "The Great Eatery",
  cuisine: "Italian",
  priceTier: "$$$",
  rating: 4.7,
  location: "Main Street",
  openHours: "11:00 - 22:00",
  distance: "5 min walk",
  onReserve: jest.fn(),
  onViewDetails: jest.fn()
};

describe('RestaurantCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<RestaurantCard {...mockProps} />);
    
    expect(screen.getByText('The Great Eatery')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('Main Street')).toBeInTheDocument();
    expect(screen.getByText(/Open: 11:00 - 22:00/)).toBeInTheDocument();
    expect(screen.getByText(/5 min walk away/)).toBeInTheDocument();
  });

  it('calls onReserve when "Reserve Table" is clicked', () => {
    render(<RestaurantCard {...mockProps} />);
    
    const reserveButton = screen.getByText('Reserve Table');
    fireEvent.click(reserveButton);
    
    expect(mockProps.onReserve).toHaveBeenCalled();
  });

  it('calls onViewDetails when "Menu" is clicked', () => {
    render(<RestaurantCard {...mockProps} />);
    
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    expect(mockProps.onViewDetails).toHaveBeenCalled();
  });

  it('renders price tier indicator correctly', () => {
    render(<RestaurantCard {...mockProps} />);
    
    const priceTierContainer = screen.getByText('$$$').parentElement;
    expect(priceTierContainer).toBeInTheDocument();
  });

  it('combines subtitle and cuisine correctly', () => {
    render(<RestaurantCard {...mockProps} subtitle="Fine Dining" />);
    
    expect(screen.getByText('Italian • Fine Dining')).toBeInTheDocument();
  });

  it('combines description with open hours and distance', () => {
    render(<RestaurantCard {...mockProps} description="A wonderful place." />);
    
    expect(screen.getByText('A wonderful place. • Open: 11:00 - 22:00 • 5 min walk away')).toBeInTheDocument();
  });

  it('does not render "Reserve Table" if onReserve not provided', () => {
    const { onReserve, ...props } = mockProps;
    render(<RestaurantCard {...props} />);
    
    expect(screen.queryByText('Reserve Table')).not.toBeInTheDocument();
  });

  it('does not render "Menu" if onViewDetails not provided', () => {
    const { onViewDetails, ...props } = mockProps;
    render(<RestaurantCard {...props} />);
    
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });
});