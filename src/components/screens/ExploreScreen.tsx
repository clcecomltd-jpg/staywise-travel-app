
import React, { useState, useEffect } from 'react';
import TopNavigation from '../TopNavigation';
import FilterBar from '../FilterBar';
import RecommendationGrid from '../RecommendationGrid';
import { Recommendation } from '../../types/database'; // Assuming types are defined here

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    category: "food",
    title: "Thai Cooking Class",
    description: "Learn authentic recipes with a local chef",
    price: 50,
    currency: "USD",
    imageUrl: "/mock/cooking.jpg"
  },
  {
    id: "2",
    category: "tours",
    title: "Canal Boat Ride",
    description: "Explore Bangkok’s hidden waterways",
    price: 30,
    currency: "USD",
    imageUrl: "/mock/boat.jpg"
  },
  {
    id: "3",
    category: "events",
    title: "Night Market Festival",
    description: "15,000 stalls of food and crafts",
    price: 0,
    currency: "FREE",
    imageUrl: "/mock/market.jpg"
  }
];

const ExploreScreen: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hostId, setHostId] = useState('some-host-id'); // Example hostId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch from an API
    // For now, we'll filter the mock data
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Example API call:
        // const response = await fetch(`/api/hosts/${hostId}/recommendations?category=${activeCategory}&limit=20`);
        // const data = await response.json();
        // setRecommendations(data);

        let filteredData = mockRecommendations;
        if (activeCategory !== 'All') {
          filteredData = filteredData.filter(rec => rec.category === activeCategory.toLowerCase());
        }
        if (searchQuery) {
          filteredData = filteredData.filter(rec => rec.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setRecommendations(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activeCategory, searchQuery, hostId]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="carousel-container">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="carousel-item h-64 glass-card rounded-2xl animate-pulse">
          <div className="h-full bg-gray-300/20 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-gray-200/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2 text-white/90">No results found</h3>
      <p className="text-white/60 mb-6">Try adjusting your filters or search terms</p>
      <button
        onClick={() => {
          setSearchQuery('');
          setActiveCategory('All');
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-red-200/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2 text-white/90">Something went wrong</h3>
      <p className="text-white/60 mb-6">{error}</p>
      <button
        onClick={() => {
          setError(null);
          // Re-trigger the effect by updating a dependency
          setHostId(prev => prev);
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="bg-app-background min-h-screen">
      <TopNavigation />
      <main className="safe-area-padding">
        <header>
          <h1 className="sr-only">Explore Recommendations</h1>
          <FilterBar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </header>

        <section aria-labelledby="recommendations-list">
          <h2 id="recommendations-list" className="sr-only">
            {loading
              ? "Loading recommendations"
              : error
                ? "Error loading recommendations"
                : recommendations.length === 0
                  ? "No recommendations found"
                  : `${recommendations.length} recommendations found`
            }
          </h2>

          {loading && <LoadingSkeleton />}
          {error && <ErrorState />}
          {!loading && !error && recommendations.length === 0 && <EmptyState />}
          {!loading && !error && recommendations.length > 0 && (
            <RecommendationGrid recommendations={recommendations} />
          )}
        </section>
      </main>
    </div>
  );
};

export default ExploreScreen;
