import React from 'react';
import { StandardizedCard } from './ui/standardized-card';
import { useCardModal } from './hooks/useCardModal';
import CardDetailsModal from './CardDetailsModal';
import { useTheme } from './contexts/ThemeContext';
import { Button } from './ui/button';

const HostRecommendationTest: React.FC = () => {
  const { isModalOpen, selectedCard, openModal, closeModal } = useCardModal();
  const { theme, toggleTheme } = useTheme();

  const hostRecommendations = [
    {
      id: 1,
      title: 'Café Vanille',
      subtitle: 'Best morning coffee spot',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      tag: '⭐ Recommended by Host',
      type: 'recommendation' as const
    },
    {
      id: 2,
      title: 'Bor Pen Nyang',
      subtitle: 'Great sunset views',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
      tag: '⭐ Recommended by Host',
      type: 'recommendation' as const
    },
    {
      id: 3,
      title: 'Jazz Lounge',
      subtitle: 'Perfect evening atmosphere',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      tag: '⭐ Recommended by Host',
      type: 'recommendation' as const
    },
    {
      id: 4,
      title: 'Night Market',
      subtitle: 'Local must-see experience',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      tag: '⭐ Recommended by Host',
      type: 'recommendation' as const
    }
  ];

  const handleRecommendationClick = (recommendation: any) => {
    openModal(recommendation, 'recommendation');
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Theme Toggle */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Host Recommendations Dark Mode Test</h1>
          <p className="text-muted-foreground">Current theme: {theme}</p>
          <Button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        {/* Host Recommendations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Host Recommendations</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2">
              View All →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
            {hostRecommendations.map((recommendation) => (
              <StandardizedCard
                key={recommendation.id}
                data={recommendation}
                onClick={() => handleRecommendationClick(recommendation)}
                variant="default"
                texturePattern="grain"
                showCTA={false}
              />
            ))}
          </div>
        </div>

        {/* Additional Test Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Different Variants</h3>
          
          {/* List View */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-foreground">List View (Minimal)</h4>
            {hostRecommendations.slice(0, 2).map((recommendation) => (
              <StandardizedCard
                key={`minimal-${recommendation.id}`}
                data={recommendation}
                onClick={() => handleRecommendationClick(recommendation)}
                variant="minimal"
                texturePattern="brushed"
                showCTA={true}
              />
            ))}
          </div>
          
          {/* Detailed View */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-foreground">Detailed View</h4>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
              {hostRecommendations.slice(0, 2).map((recommendation) => (
                <StandardizedCard
                  key={`detailed-${recommendation.id}`}
                  data={recommendation}
                  onClick={() => handleRecommendationClick(recommendation)}
                  variant="detailed"
                  texturePattern="fabric"
                  showCTA={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Color Test Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Color Test</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="text-card-foreground font-medium">Card Background</p>
              <p className="text-muted-foreground text-sm">Should have proper contrast</p>
            </div>
            
            <div className="bg-background border border-border p-4 rounded-lg">
              <p className="text-foreground font-medium">App Background</p>
              <p className="text-muted-foreground text-sm">Main app background</p>
            </div>
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

export default HostRecommendationTest;