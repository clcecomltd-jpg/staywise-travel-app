import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTopCard from '../HomeTopCard';

describe('HomeTopCard', () => {
  const defaultProps = {
    propertyName: 'Test Property',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    temperatureC: 25,
    weatherIcon: 'sun' as const,
  };

  it('renders with required props', () => {
    render(<HomeTopCard {...defaultProps} />);
    
    expect(screen.getByText('Welcome Home, Guest')).toBeInTheDocument();
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });

  it('renders with custom guest name', () => {
    render(<HomeTopCard {...defaultProps} guestName="John" />);
    
    expect(screen.getByText('Welcome Home, John')).toBeInTheDocument();
  });

  it('calls onPropertyClick when property button is clicked', () => {
    const mockOnPropertyClick = jest.fn();
    render(<HomeTopCard {...defaultProps} onPropertyClick={mockOnPropertyClick} />);
    
    const propertyButton = screen.getByLabelText(/View details for Test Property/);
    fireEvent.click(propertyButton);
    
    expect(mockOnPropertyClick).toHaveBeenCalledTimes(1);
  });

  it('renders without temperature when not provided', () => {
    const { temperatureC, ...propsWithoutTemp } = defaultProps;
    render(<HomeTopCard {...propsWithoutTemp} />);
    
    expect(screen.queryByText('°C')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HomeTopCard {...defaultProps} />);

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-labelledby', 'welcome-heading');

    const title = screen.getByText('Welcome Home, Guest');
    expect(title).toHaveAttribute('id', 'welcome-heading');
  });

  it('applies custom className', () => {
    const { container } = render(<HomeTopCard {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
