
import React, { useState, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button'; // from shadcn/ui
import FilterModal from './FilterModal';

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const categories = ['All', 'Food', 'Tours', 'Events', 'Experiences', 'Essentials'];

// Custom debounce hook for performance
const useDebounce = (callback: (value: string) => void, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((value: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(value);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

const FilterBar: React.FC<FilterBarProps> = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) => {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search input to improve performance
  const debouncedSearch = useDebounce(setSearchQuery, 300);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Memoize category buttons to prevent unnecessary re-renders
  const categoryButtons = useMemo(() => (
    categories.map((category) => (
      <button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`chip-tap-glow glass-button whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors
        ${activeCategory === category ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        aria-pressed={activeCategory === category}
      >
        {category}
      </button>
    ))
  ), [activeCategory, setActiveCategory]);

  return (
    <div className="sticky top-16 z-40 bg-app-background/80 py-4 backdrop-blur-md">
        <div className="container px-4 md:px-6">
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search experiences..."
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        className="glass-card w-full rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Search experiences and recommendations"
                    />
                </div>
                <Button variant="outline" className="glass-button flex-shrink-0" onClick={() => setFilterModalOpen(true)}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Filter by category">
                {categoryButtons}
            </div>
        </div>
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </div>
  );
};

export default FilterBar;
