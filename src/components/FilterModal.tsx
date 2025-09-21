
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="dropdown-slide fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-lg glass-float">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">Filters</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Refine your search for the perfect experience.
          </Dialog.Description>
          
          <div className="mt-6 space-y-6">
            {/* Price Slider */}
            <div>
              <label className="block text-sm font-medium">Price Range</label>
              {/* Placeholder for a slider component */}
              <div className="mt-2 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Distance Slider */}
            <div>
              <label className="block text-sm font-medium">Distance (km)</label>
              {/* Placeholder for a slider component */}
              <div className="mt-2 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium">Date</label>
              {/* Placeholder for a date picker component */}
              <div className="mt-2 h-12 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium">Rating</label>
              {/* Placeholder for star rating component */}
              <div className="mt-2 flex gap-1 text-2xl text-gray-300 dark:text-gray-600">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            {/* Host-only offers toggle */}
            <div className="flex items-center justify-between">
              <label className="font-medium">Host-only offers</label>
              {/* Placeholder for a switch/toggle component */}
              <div className="h-6 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="secondary">Reset</Button>
            <Button>Apply Filters</Button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FilterModal;
