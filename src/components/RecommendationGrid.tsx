
import React from 'react';
import RecommendationCard from './RecommendationCard';
import { Recommendation } from '../types/database'; // Assuming types are defined here

interface RecommendationGridProps {
  recommendations: Recommendation[];
}

const RecommendationGrid: React.FC<RecommendationGridProps> = ({ recommendations }) => {
  return (
    <section className="container px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
      {recommendations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-24 text-center dark:border-gray-700">
            <p className="text-lg font-medium text-gray-500">No recommendations found.</p>
            <p className="mt-2 text-sm text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </section>
  );
};

export default RecommendationGrid;
