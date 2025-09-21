import React, { useMemo, useState } from 'react';
import { BookmarkPlus, Clock, Heart, MapPin, Star } from 'lucide-react';

import ScreenHeader from '../ScreenHeader';
import { GlassCard } from '../ui/glass-card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface HostRecommendationsScreenProps {
  onBack: () => void;
  onBackToOnboarding?: () => void;
}

type RecommendationCategory = 'Food' | 'Experiences' | 'Wellness' | 'Nightlife';

interface RecommendationItem {
  id: number;
  category: RecommendationCategory;
  title: string;
  neighborhood: string;
  description: string;
  image: string;
  rating: number;
  eta: string;
  cost: string;
}

const recommendations: RecommendationItem[] = [
  {
    id: 1,
    category: 'Food',
    title: 'Thip Samai Pad Thai',
    neighborhood: 'Old Town',
    description: 'Legendary charcoal-fired pad thai served with fresh prawns and tamarind sauce.',
    image: 'https://images.unsplash.com/photo-1604908176779-90a2d0f78c26?w=600&h=400&fit=crop&crop=center',
    rating: 4.8,
    eta: '12 min by taxi',
    cost: '$$'
  },
  {
    id: 2,
    category: 'Food',
    title: 'Tep Bar',
    neighborhood: 'Chinatown',
    description: 'Craft cocktails with Thai herbs and live traditional music every evening.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc1?w=600&h=400&fit=crop&crop=center',
    rating: 4.7,
    eta: '15 min by tuk-tuk',
    cost: '$$'
  },
  {
    id: 3,
    category: 'Experiences',
    title: 'Twilight Temple Hopping',
    neighborhood: 'Rattanakosin',
    description: 'Private long-tail boat tour around Wat Arun and the Grand Palace with sunset views.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&crop=center',
    rating: 4.9,
    eta: 'Pick-up at villa',
    cost: '$$$'
  },
  {
    id: 4,
    category: 'Experiences',
    title: 'Floating Market Morning',
    neighborhood: 'Damnoen Saduak',
    description: 'Leave at dawn for a hosted tour with breakfast on the boat and craft shopping.',
    image: 'https://images.unsplash.com/photo-1664799420158-8f7b79ee3e6f?w=600&h=400&fit=crop&crop=center',
    rating: 4.6,
    eta: '40 min drive',
    cost: '$$'
  },
  {
    id: 5,
    category: 'Wellness',
    title: 'Let’s Relax Spa',
    neighborhood: 'Thonglor',
    description: 'Aromatic Thai massage with herbal tea lounge. Maria’s favourite after long flights.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1f0d4cb?w=600&h=400&fit=crop&crop=center',
    rating: 4.8,
    eta: '18 min by BTS',
    cost: '$$'
  },
  {
    id: 6,
    category: 'Nightlife',
    title: 'Sky Beach Rooftop',
    neighborhood: 'Sathorn',
    description: 'Al fresco craft drinks 78 floors up with nightly DJ and skyline views.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center',
    rating: 4.7,
    eta: '20 min by taxi',
    cost: '$$$'
  }
];

const recommendationCategories: RecommendationCategory[] = ['Food', 'Experiences', 'Wellness', 'Nightlife'];

const HostRecommendationsScreen: React.FC<HostRecommendationsScreenProps> = ({ onBack, onBackToOnboarding }) => {
  const [activeCategory, setActiveCategory] = useState<RecommendationCategory>('Food');
  const [favourites, setFavourites] = useState<Set<number>>(new Set());

  const filteredRecommendations = useMemo(
    () => recommendations.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const toggleFavourite = (id: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openMaps = (title: string) => {
    const encoded = encodeURIComponent(`${title}, Bangkok`);
    window.open(`https://maps.google.com/?q=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <ScreenHeader
        title="Host Picks"
        subtitle="Maria has saved these just for you"
        onBack={onBack}
        onBackToOnboarding={onBackToOnboarding}
        showTravelGuideLink={false}
      />

      <div className="px-6 py-6 pb-24 space-y-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="rounded-full bg-primary/10 text-primary">Curated by Maria</Badge>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Tailored experiences for your stay</h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Each recommendation comes with a personal note and extra context so you know why it matters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {recommendationCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background/60 text-muted-foreground hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-5">
          {filteredRecommendations.map((item) => (
            <GlassCard key={item.id} className="overflow-hidden p-0">
              <div className="grid gap-0 sm:grid-cols-[240px_1fr]">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span>{item.neighborhood}</span>
                      <span>{item.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFavourite(item.id)}
                      className={`rounded-full border px-3 py-2 transition-colors ${
                        favourites.has(item.id)
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                          : 'border-border/40 text-muted-foreground hover:bg-primary/10'
                      }`}
                      aria-label="Save recommendation"
                    >
                      <Heart className="h-4 w-4" fill={favourites.has(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span>{item.rating.toFixed(1)} host rating</span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.eta}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      Maria’s tip: ask for the StayWise perk when you arrive.
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button size="sm" onClick={() => openMaps(item.title)}>
                        <MapPin className="h-4 w-4" />
                        <span className="ml-2">Open in Maps</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toggleFavourite(item.id)}>
                        <BookmarkPlus className="h-4 w-4" />
                        <span className="ml-2">{favourites.has(item.id) ? 'Saved' : 'Save for later'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostRecommendationsScreen;
