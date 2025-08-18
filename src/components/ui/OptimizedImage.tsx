import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  imgClassName,
  onClick,
  priority = false,
  fill = false,
  width,
  height
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} onClick={onClick}>
      {/* Show placeholder while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-surface-200 animate-pulse z-10" />
      )}
      
      {/* Show error state */}
      {hasError && (
        <div className="absolute inset-0 bg-surface-300 flex items-center justify-center z-10">
          <span className="text-surface-500 text-sm">Failed to load</span>
        </div>
      )}
      
      {/* Next.js optimized image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width || 800}
          height={fill ? undefined : height || 600}
          sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
          priority={priority}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyugDYkzBBiGzL2iq1g+2WCkUl0hhkkKSbHZQ7tBE0+vMPE0TP7kJjM3LGAJ2C4dOIp4vM5a+FUVUhUg5/CWAo1HWGqpKgHKHhbwBk1f7kUkS7D7TtHTIy4ug9R/9k="
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            imgClassName
          )}
          style={{ objectFit: 'cover' }}
        />
      )}
    </div>
  );
}