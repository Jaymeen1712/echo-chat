import React, { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  lazy?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  fallbackSrc,
  placeholder,
  lazy = true,
  quality = 80,
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized image URL (if using a CDN or image optimization service)
  const getOptimizedSrc = (originalSrc: string) => {
    // This is a placeholder - replace with your actual image optimization logic
    // For example, if using Cloudinary, Vercel, or other image optimization services
    if (originalSrc.startsWith('http') && quality < 100) {
      // Add quality parameter if it's an external URL
      const url = new URL(originalSrc);
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }
    return originalSrc;
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : getOptimizedSrc(src);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Placeholder while loading */}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {placeholder}
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          {...props}
        />
      )}

      {/* Loading state */}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
