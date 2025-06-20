// components/ImageWithFallback.js
import { useState, useEffect } from 'react';

const ImageWithFallback = ({ src, alt, className, fallback, onError }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
    
    // Check if the image URL is valid
    if (!src || src.trim() === '') {
      setHasError(true);
      setIsLoading(false);
    }
  }, [src]);

  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setHasError(true);
    setIsLoading(false);
    if (onError) onError();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If there's an error or no src, show fallback
  if (hasError || !imgSrc) {
    return fallback || (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}>
        <span>👤</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 ${className}`}>
          <div className="w-6 h-6 border-b-2 border-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;