import React from 'react';
import { MapPin, Clock, Star, UtensilsCrossed, DollarSign } from 'lucide-react';
import { ContentCard, ContentCardProps } from './ContentCard';

export interface RestaurantCardProps extends Omit<ContentCardProps, 'meta'> {
  cuisine: string;
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  location: string;
  openHours?: string;
  distance?: string;
  onReserve?: () => void;
  onViewDetails?: () => void;
  onDirections?: () => void;
}

const PriceTierIndicator: React.FC<{ tier: string }> = ({ tier }) => {
    const tierCount = tier.length;
    const maxTiers = 4;

    const accessibleLabel = `${tierCount} out of ${maxTiers} price tier`;

    return (
        <div className="flex items-center gap-1" role="img" aria-label={accessibleLabel}>
            {Array.from({ length: maxTiers }, (_, i) => (
                <DollarSign
                    key={i}
                    className={`w-3 h-3 ${
                        i < tierCount
                            ? 'text-green-400'
                            : 'text-white/30 dark:text-white/30 light:text-gray-300'
                    }`}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
    cuisine,
    priceTier,
    rating,
    location,
    openHours,
    distance,
    onReserve,
    onViewDetails,
    onDirections,
    ...props
}) => {
    const restaurantActions = props.actions || {
        primary: onReserve ? { label: "Reserve Table", onClick: onReserve } : undefined,
        secondary: onViewDetails ? { label: "Menu", onClick: onViewDetails } : undefined,
    };

    const enhancedSubtitle = props.subtitle ? `${cuisine} • ${props.subtitle}` : cuisine;

    const descriptionParts = [
        props.description,
        openHours && `Open: ${openHours}`,
        distance && `${distance} away`,
    ].filter(Boolean);
    const enhancedDescription = descriptionParts.join(' • ');

    return (
        <ContentCard
            {...props}
            subtitle={enhancedSubtitle}
            description={enhancedDescription}
            meta={{
                location,
                category: cuisine,
            }}
            actions={restaurantActions}
            rating={rating}
            price={priceTier}
            priceFrom={false}
        >
            <PriceTierIndicator tier={priceTier} />
        </ContentCard>
    );
};

export default RestaurantCard;
