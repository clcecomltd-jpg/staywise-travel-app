import React from 'react';
import { Clock, MapPin, Users, Zap } from 'lucide-react';
import { ContentCard, ContentCardProps } from './ContentCard';

export interface ActivityCardProps extends Omit<ContentCardProps, 'meta'> {
  duration: string;
  location: string;
  capacity?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category: string;
  onBook?: () => void;
  onViewDetails?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  duration,
  location,
  capacity,
  difficulty,
  category,
  onBook,
  onViewDetails,
  actions,
  ...props
}) => {
  const activityActions = actions || {
    primary: onBook ? {
      label: "Book Now",
      onClick: onBook
    } : undefined,
    secondary: onViewDetails ? {
      label: "Details",
      onClick: onViewDetails
    } : undefined
  };

  return (
    <ContentCard
      {...props}
      meta={{
        location,
        duration,
        capacity,
        difficulty,
        category
      }}
      actions={activityActions}
    />
  );
};

export default ActivityCard;
