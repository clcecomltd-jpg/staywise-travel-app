import { useState } from 'react';
import { CardData } from '../CardDetailsModal';

// Helper function to transform different card types to CardData format
export const transformToCardData = (item: any, type: CardData['type'] = 'venue'): CardData => {
  // Generate mock detailed data based on the card type and existing data
  const generateMockDetails = (item: any, type: CardData['type']) => {
    const baseData = {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      distance: item.distance,
      rating: item.rating,
      image: item.image,
      type,
      emoji: item.emoji,
      tag: item.tag,
      ctaText: item.ctaText
    };

    // Add type-specific details
    switch (type) {
      case 'venue':
        return {
          ...baseData,
          description: `Experience the best of ${item.title}. A carefully curated space offering exceptional service and atmosphere. Perfect for both locals and travelers looking for authentic experiences.`,
          address: `${Math.floor(Math.random() * 999) + 1} Setthathirath Road, Vientiane`,
          phone: `+856 ${Math.floor(Math.random() * 9000000) + 1000000}`,
          website: `www.${item.title.toLowerCase().replace(/\s+/g, '')}.com`,
          hours: item.category?.includes('Café') ? 'Mon-Sun: 7:00 AM - 6:00 PM' : 
                 item.category?.includes('Bar') ? 'Daily: 5:00 PM - 2:00 AM' :
                 item.category?.includes('Restaurant') ? 'Daily: 11:00 AM - 10:00 PM' :
                 'Daily: 9:00 AM - 6:00 PM',
          ctaText: 'View Details'
        };

      case 'offer':
        const prices = ['$25', '$45', '$65', '$85', '$120'];
        const price = prices[Math.floor(Math.random() * prices.length)];
        return {
          ...baseData,
          description: `${item.title} - ${item.subtitle || 'An exclusive offer just for you'}. Limited time availability with special guest rates.`,
          price,
          priceDescription: 'per person',
          availability: 'Available daily - advance booking recommended',
          phone: `+856 ${Math.floor(Math.random() * 9000000) + 1000000}`,
          ctaText: item.ctaText || 'Book Now'
        };

      case 'event':
        return {
          ...baseData,
          description: `Join us for ${item.title}. ${item.subtitle || 'A special event you won\'t want to miss'}. Experience local culture and entertainment.`,
          address: `${Math.floor(Math.random() * 999) + 1} Cultural Center, Vientiane`,
          availability: 'Next event: This Weekend',
          hours: item.category?.includes('Jazz') ? '8:00 PM - 12:00 AM' :
                 item.category?.includes('Market') ? '5:00 PM - 11:00 PM' :
                 '7:00 PM - 11:00 PM',
          price: '$15',
          priceDescription: 'entry fee',
          ctaText: 'Get Tickets'
        };

      case 'recommendation':
        return {
          ...baseData,
          hostNote: `"${item.subtitle || 'One of my personal favorites - you\'ll love this place!'}" - Your Host`,
          description: `Personally recommended by your host. ${item.title} offers an authentic local experience that shouldn't be missed.`,
          address: `${Math.floor(Math.random() * 999) + 1} Local District, Vientiane`,
          hours: 'Daily: 9:00 AM - 9:00 PM',
          ctaText: 'Visit Place'
        };

      case 'essential':
        return {
          ...baseData,
          description: `Essential information about ${item.title}. Everything you need to know for a smooth and comfortable stay.`,
          ctaText: 'View Guide'
        };

      default:
        return baseData;
    }
  };

  return generateMockDetails(item, type);
};

export const useCardModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const openModal = (item: any, type: CardData['type'] = 'venue') => {
    const cardData = transformToCardData(item, type);
    setSelectedCard(cardData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return {
    isModalOpen,
    selectedCard,
    openModal,
    closeModal
  };
};

export default useCardModal;