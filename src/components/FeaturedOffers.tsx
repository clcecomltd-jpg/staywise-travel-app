import React from 'react';
import { Utensils, Calendar, Map, Smartphone, Coffee, Wine, Camera, Car, Building2, Mic, ShoppingBag, Plane } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { StandardizedCard } from './ui/standardized-card';
import { Button } from './ui/button';

interface FeaturedOffer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  emoji: string;
  ctaText: string;
  category: 'eatDrink' | 'eventsActivities' | 'tours' | 'esim';
  featured?: boolean;
  description?: string;
  price?: string;
  priceDescription?: string;
  availability?: string;
  rating?: number;
}

interface FeaturedOffersProps {
  onOfferClick?: (offer: FeaturedOffer) => void;
  className?: string;
}

const FeaturedOffers: React.FC<FeaturedOffersProps> = ({ onOfferClick, className = '' }) => {
  const featuredOffers: FeaturedOffer[] = [
    // Eat & Drink
    {
      id: 'wine-dinner',
      title: 'Wine Tasting Dinner',
      subtitle: '5-course meal with wine pairing',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
      emoji: '🍷',
      ctaText: 'Book Now',
      category: 'eatDrink',
      featured: true,
      description: 'Join us for an exclusive 5-course dinner featuring the finest local wines paired with expertly crafted dishes. Each course has been carefully selected to complement the wine selection, creating a perfect harmony of flavors.',
      price: '$75/person',
      priceDescription: 'Includes 5 courses + wine pairings',
      availability: 'Every Saturday, 7:00 PM',
      rating: 4.8
    },
    {
      id: 'street-food',
      title: 'Street Food Tour',
      subtitle: 'Authentic local flavors',
      image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=300&fit=crop',
      emoji: '🍔',
      ctaText: 'Reserve Spot',
      category: 'eatDrink',
      featured: true,
      description: 'Discover the vibrant street food scene with our guided tour through the bustling local markets and hidden food stalls. Taste authentic dishes that locals love, from savory noodles to sweet desserts.',
      price: '$35/person',
      priceDescription: 'Includes 8+ food tastings',
      availability: 'Daily, 5:00 PM - 8:00 PM',
      rating: 4.9
    },
    {
      id: 'cooking-class',
      title: 'Traditional Cooking Class',
      subtitle: 'Learn local recipes with chef',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      emoji: '👨‍🍳',
      ctaText: 'Join Class',
      category: 'eatDrink',
      description: 'Learn to cook authentic local dishes with our experienced chef. This hands-on class covers traditional techniques and family recipes passed down through generations.',
      price: '$45/person',
      priceDescription: 'Includes all ingredients + meal',
      availability: 'Weekends, 10:00 AM - 1:00 PM',
      rating: 4.7
    },
    {
      id: 'coffee-experience',
      title: 'Coffee Roasting Experience',
      subtitle: 'From bean to cup journey',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      emoji: '☕',
      ctaText: 'Book Session',
      category: 'eatDrink',
      description: 'Learn the art of coffee roasting from local experts. Understand the journey from green beans to perfect cup, including hands-on roasting and professional cupping session.',
      price: '$28/person',
      priceDescription: 'Includes beans to take home',
      availability: 'Tuesday to Friday, 2:00 PM',
      rating: 4.6
    },

    // Events & Activities
    {
      id: 'jazz-night',
      title: 'Jazz Night Tickets',
      subtitle: 'Live music every Friday',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      emoji: '🎶',
      ctaText: 'Buy Tickets',
      category: 'eventsActivities',
      featured: true,
      description: 'Experience the best of local jazz talent in an intimate setting. Every Friday night features different artists performing classic jazz standards and original compositions.',
      price: '$25/person',
      priceDescription: 'Includes welcome drink',
      availability: 'Every Friday, 8:00 PM - 11:00 PM',
      rating: 4.8
    },
    {
      id: 'cultural-show',
      title: 'Traditional Dance Show',
      subtitle: 'Authentic cultural performance',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop',
      emoji: '🎭',
      ctaText: 'Book Seats',
      category: 'eventsActivities',
      featured: true,
      description: 'Witness the beauty of traditional dance and music performed by talented local artists. This cultural show showcases centuries-old traditions and storytelling through movement.',
      price: '$20/person',
      priceDescription: 'Premium seating available',
      availability: 'Saturday & Sunday, 7:30 PM',
      rating: 4.9
    },
    {
      id: 'night-market',
      title: 'Night Market Experience',
      subtitle: 'Shopping and street food',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      emoji: '🌃',
      ctaText: 'Get Guide',
      category: 'eventsActivities',
      description: 'Navigate the bustling night market with a local guide who knows the best stalls for shopping, street food, and unique local crafts. Perfect for first-time visitors.',
      price: '$15/person',
      priceDescription: 'Guide service only',
      availability: 'Daily, 6:00 PM - 10:00 PM',
      rating: 4.4
    },
    {
      id: 'art-workshop',
      title: 'Art & Craft Workshop',
      subtitle: 'Create traditional handicrafts',
      image: 'https://images.unsplash.com/photo-1504594806722-11e4b975ce4a?w=400&h=300&fit=crop',
      emoji: '🎨',
      ctaText: 'Join Workshop',
      category: 'eventsActivities',
      description: 'Learn traditional handicraft techniques from local artisans. Create your own unique piece to take home while supporting local craftspeople.',
      price: '$32/person',
      priceDescription: 'All materials included',
      availability: 'Wednesday & Saturday, 3:00 PM',
      rating: 4.5
    },

    // Tours
    {
      id: 'city-highlights',
      title: 'City Highlights Tour',
      subtitle: 'All major attractions',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      emoji: '🎟️',
      ctaText: 'Book Tour',
      category: 'tours',
      featured: true,
      description: 'Comprehensive tour covering all major landmarks and attractions. Perfect introduction to the city with knowledgeable local guide sharing history and insider tips.',
      price: '$42/person',
      priceDescription: 'Includes transport & entry fees',
      availability: 'Daily, 9:00 AM & 2:00 PM',
      rating: 4.7
    },
    {
      id: 'temple-tour',
      title: 'Sacred Temples Tour',
      subtitle: 'Historical and spiritual sites',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop',
      emoji: '⛩️',
      ctaText: 'Reserve Now',
      category: 'tours',
      description: 'Explore ancient temples and learn about local spiritual traditions. This respectful tour includes historical context and cultural significance of each sacred site.',
      price: '$38/person',
      priceDescription: 'Small group tour',
      availability: 'Daily except Sundays, 8:00 AM',
      rating: 4.8
    },
    {
      id: 'river-cruise',
      title: 'Mekong River Cruise',
      subtitle: 'Scenic sunset boat ride',
      image: 'https://images.unsplash.com/photo-1571021173240-0ded1abd7e8e?w=400&h=300&fit=crop',
      emoji: '🛥️',
      ctaText: 'Book Cruise',
      category: 'tours',
      featured: true,
      description: 'Relax on a scenic river cruise during golden hour. Enjoy stunning sunset views while learning about river life and local communities along the banks.',
      price: '$45/person',
      priceDescription: 'Includes refreshments',
      availability: 'Daily, 5:30 PM - 7:30 PM',
      rating: 4.6
    },
    {
      id: 'photography-walk',
      title: 'Photography Walking Tour',
      subtitle: "Capture the city's essence",
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      emoji: '📸',
      ctaText: 'Join Tour',
      category: 'tours',
      description: 'Perfect for photography enthusiasts! Visit the most photogenic spots in the city with tips from professional photographer guide.',
      price: '$35/person',
      priceDescription: 'Photography tips included',
      availability: 'Saturday & Sunday, 6:00 AM',
      rating: 4.5
    },

    // eSIM
    {
      id: 'data-plan',
      title: 'Travel Data Plan',
      subtitle: '10GB for 30 days',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      emoji: '📶',
      ctaText: 'Get eSIM',
      category: 'esim',
      featured: true,
      description: 'Perfect for extended stays! Get fast 4G/5G data with our reliable local network. Easy activation and top-up options available.',
      price: '$35',
      priceDescription: '10GB valid for 30 days',
      availability: 'Instant activation',
      rating: 4.3
    },
    {
      id: 'unlimited-plan',
      title: 'Unlimited eSIM',
      subtitle: 'No data limits, 15 days',
      image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=300&fit=crop',
      emoji: '📲',
      ctaText: 'Buy Now',
      category: 'esim',
      featured: true,
      description: 'Stream, share, and stay connected without worry. Unlimited data on high-speed local network, perfect for heavy users and content creators.',
      price: '$55',
      priceDescription: 'Unlimited data for 15 days',
      availability: 'Instant activation',
      rating: 4.7
    },
    {
      id: 'regional-plan',
      title: 'Asia Regional eSIM',
      subtitle: 'Works in 12 countries',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      emoji: '🌏',
      ctaText: 'Get Plan',
      category: 'esim',
      description: 'Travel across Asia with one eSIM! Works in 12 countries including Thailand, Vietnam, Singapore, and more. No need to switch SIMs.',
      price: '$65',
      priceDescription: '15GB across 12 countries',
      availability: 'Valid for 30 days',
      rating: 4.4
    },
    {
      id: 'pocket-wifi',
      title: 'Portable WiFi Hotspot',
      subtitle: 'Share with up to 5 devices',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      emoji: '📡',
      ctaText: 'Rent Device',
      category: 'esim',
      description: 'Share internet with your travel group! Portable device with long battery life and fast speeds. Perfect for families or business travelers.',
      price: '$8/day',
      priceDescription: 'Unlimited data, up to 5 devices',
      availability: 'Pickup at airport or hotel',
      rating: 4.2
    }
  ];

  const handleOfferClick = (offer: FeaturedOffer) => {
    onOfferClick?.(offer);
  };

  const handleViewAll = () => {
    console.log('View all featured offers');
  };

  // Get featured offers (those marked as featured)
  const getFeaturedOffers = () => {
    return featuredOffers.filter(offer => offer.featured);
  };

  // Add the featured badge to card data
  const formatOfferForCard = (offer: FeaturedOffer) => ({
    id: offer.id,
    title: offer.title,
    subtitle: offer.subtitle,
    image: offer.image,
    emoji: offer.emoji,
    ctaText: offer.ctaText,
    tag: offer.featured ? '⭐ Featured' : undefined,
    type: 'offer' as const,
    description: offer.description,
    price: offer.price,
    priceDescription: offer.priceDescription,
    availability: offer.availability,
    rating: offer.rating
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-foreground">Featured Offers</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2"
          onClick={handleViewAll}
        >
          View All →
        </Button>
      </div>
      
      <ScrollArea orientation="horizontal" className="w-full">
        <div className="flex space-x-4 pb-2 scrollbar-hide">
          {getFeaturedOffers().map((offer) => (
            <StandardizedCard
              key={offer.id}
              data={formatOfferForCard(offer)}
              onClick={() => handleOfferClick(offer)}
              variant="detailed"
              texturePattern="grain"
              className="flex-shrink-0 w-72"
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FeaturedOffers;