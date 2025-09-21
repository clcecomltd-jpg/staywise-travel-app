import React, { useState, useCallback } from 'react';
import { OnboardingLoader } from './loading-states';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fallbackColor?: string;
  showLoader?: boolean;
  className?: string;
  onLoadComplete?: () => void;
  onError?: (error: string) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  fallbackColor = 'linear-gradient(135deg, #1a1a2e, #16213e)',
  showLoader = true,
  className = '',
  onLoadComplete,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image first
      setCurrentSrc(fallbackSrc);
      return;
    }

    // If fallback also fails or no fallback provided, show color background
    setHasError(true);
    const target = e.target as HTMLImageElement;
    target.style.background = fallbackColor;
    target.style.minHeight = '200px';

    onError?.('Failed to load image');
  }, [fallbackSrc, currentSrc, fallbackColor, onError]);

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
        style={{ background: fallbackColor, minHeight: '200px' }}
        role="img"
        aria-label={`${alt} (image unavailable)`}
      >
        <span className="text-white/60 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <OnboardingLoader message="Loading..." />
        </div>
      )}

      {/* Optimized image */}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        // Add srcset for responsive images if available
        srcSet={props.srcSet}
        sizes={props.sizes || '(max-width: 430px) 100vw, 430px'}
      />
    </div>
  );
};

// Preload utility for critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

// Hook for managing image preloading
export const useImagePreloader = (imageSources: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadImages = useCallback(async () => {
    setIsPreloading(true);
    const loaded = new Set<string>();

    try {
      await Promise.allSettled(
        imageSources.map(async (src) => {
          try {
            await preloadImage(src);
            loaded.add(src);
          } catch (error) {
            console.warn(`Failed to preload image: ${src}`, error);
          }
        })
      );
    } finally {
      setLoadedImages(loaded);
      setIsPreloading(false);
    }
  }, [imageSources]);

  return {
    preloadImages,
    loadedImages,
    isPreloading,
    isImageLoaded: (src: string) => loadedImages.has(src)
  };
};