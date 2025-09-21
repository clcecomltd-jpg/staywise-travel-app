import React from 'react';
import { StandardizedCard } from './ui/standardized-card';
import { useCardModal } from './hooks/useCardModal';
import CardDetailsModal from './CardDetailsModal';

const TestCards: React.FC = () => {
  const { isModalOpen, selectedCard, openModal, closeModal } = useCardModal();

  const testCards = [
    {
      id: 1,
      title: "Café Vanille",
      subtitle: "Best morning coffee spot",
      category: "Café ☕",
      distance: "300m",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      tag: "⭐ Host Recommended",
      type: 'recommendation' as const
    },
    {
      id: 2,
      title: "Wine Tasting Dinner",
      subtitle: "5-course meal with pairing",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
      emoji: "🍷",
      ctaText: "Book Now",
      type: 'offer' as const
    },
    {
      id: 3,
      title: "Travel eSIM Deals",
      subtitle: "Stay connected anywhere",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      emoji: "🌐",
      ctaText: "View Offers",
      tag: "⭐ Featured",
      type: 'offer' as const
    }
  ];

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Card Test Page</h1>
        
        {/* Grid View Test */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Grid View (Default Variant)</h2>
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
            {testCards.map((card) => (
              <StandardizedCard
                key={`grid-${card.id}`}
                data={card}
                onClick={() => openModal(card, card.type)}
                variant="default"
                texturePattern="grain"
                showCTA={false}
              />
            ))}
          </div>
        </div>

        {/* Detailed View Test */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Detailed View with CTA</h2>
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
            {testCards.slice(1).map((card) => (
              <StandardizedCard
                key={`detailed-${card.id}`}
                data={card}
                onClick={() => openModal(card, card.type)}
                variant="detailed"
                texturePattern="fabric"
                showCTA={true}
              />
            ))}
          </div>
        </div>

        {/* List View Test */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">List View (Minimal Variant)</h2>
          <div className="space-y-3">
            {testCards.map((card) => (
              <StandardizedCard
                key={`list-${card.id}`}
                data={card}
                onClick={() => openModal(card, card.type)}
                variant="minimal"
                texturePattern="brushed"
                showCTA={true}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Test */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Horizontal Scroll</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {testCards.map((card) => (
              <StandardizedCard
                key={`horizontal-${card.id}`}
                data={card}
                onClick={() => openModal(card, card.type)}
                variant="detailed"
                texturePattern="paper"
                className="flex-shrink-0 w-72"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CardDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedCard}
      />
    </div>
  );
};

export default TestCards;