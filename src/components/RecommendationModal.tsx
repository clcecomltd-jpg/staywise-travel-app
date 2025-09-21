
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Star, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Recommendation } from '../types/database';
import { Button } from './ui/button';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ isOpen, onClose, recommendation }) => {
  const { title, category, description, imageUrl } = recommendation;

  // Mock data
  const images = [imageUrl, '/mock/boat.jpg', '/mock/market.jpg'];
  const host = { name: 'Kittichai', avatarUrl: '/mock/host-avatar.jpg', rating: 4.9 };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 animate-fade-in" />
        <Dialog.Content className="glass-float animate-fade-in fixed z-50 inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl overflow-y-auto">
          <div className="relative">
            {/* Image Carousel */}
            <div className="carousel-snap flex h-64 w-full overflow-x-auto scrollbar-hide">
              {images.map((src, index) => (
                <img key={index} src={src} alt={`${title} image ${index + 1}`} className="h-full w-full flex-shrink-0 object-cover" />
              ))}
            </div>

            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-opacity hover:opacity-80" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6">
            <p className="text-sm font-semibold uppercase text-primary">{category}</p>
            <Dialog.Title className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{title}</Dialog.Title>
            
            {/* Host Info */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={host.avatarUrl} alt={host.name} className="h-12 w-12 rounded-full object-cover"/>
                    <div>
                        <p className="font-semibold">Hosted by {host.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                            <span>{host.rating}</span>
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4"/>
                    Contact
                </Button>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h4 className="font-semibold">About this experience</h4>
              <p className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{description}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Button size="lg" className="md:col-span-1">
                    <MapPin className="mr-2 h-4 w-4"/>
                    Directions
                </Button>
                <Button size="lg" variant="secondary" className="md:col-span-1">Save</Button>
                <Button size="lg" className="md:col-span-1">Book Now</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RecommendationModal;
