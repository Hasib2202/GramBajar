// components/ImageCarousel.js
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Modern icon components with better styling
const ChevronLeft = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const BLUR_DATA_URL = '/images/veg.jpg';

export default function ImageCarousel({ darkMode = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState('next');
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    { 
      id: 1, 
      src: '/images/freshfish.jpg', 
      alt: 'Fresh Fish', 
      title: 'Fresh Fish', 
      description: 'Ocean fresh, daily catch',
      category: 'Seafood',
      fallback: '🐟' 
    },
    { 
      id: 2, 
      src: '/images/veg2.jpg', 
      alt: 'Organic Fruits', 
      title: 'Organic Fruits', 
      description: 'Farm fresh, naturally grown',
      category: 'Fruits',
      fallback: '🍎🍊🍌' 
    },
    { 
      id: 3, 
      src: '/images/freshveg.jpg', 
      alt: 'Fresh Vegetables', 
      title: 'Fresh Vegetables', 
      description: 'Garden fresh, pesticide free',
      category: 'Vegetables',
      fallback: '🥕🥬🍅' 
    },
    { 
      id: 4, 
      src: '/images/PremiumMeat.jpg', 
      alt: 'Premium Meat', 
      title: 'Premium Meat', 
      description: 'High quality, ethically sourced',
      category: 'Meat',
      fallback: '🥩' 
    },
    { 
      id: 5, 
      src: '/images/Dairy.jpg', 
      alt: 'Dairy Products', 
      title: 'Dairy Products', 
      description: 'Fresh milk, eggs & more',
      category: 'Dairy',
      fallback: '🥛🥚' 
    },
    { 
      id: 6, 
      src: '/images/cooking.jpg', 
      alt: 'Cooking Essentials', 
      title: 'Cooking Essentials', 
      description: 'All your kitchen needs',
      category: 'Pantry',
      fallback: '🧄🧅🌶️' 
    }
  ];

  // Auto-slide with play/pause functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setDirection('next');
      setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length, isPlaying]);

  // Enhanced touch handlers with better gesture detection
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart === null || touchEnd === null) return;
    
    const distance = touchStart - touchEnd;
    const threshold = 75; // Increased threshold for better UX
    
    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, [touchStart, touchEnd]);

  const nextSlide = useCallback(() => {
    setDirection('next');
    setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setDirection('prev');
    setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goToSlide = useCallback((idx) => {
    setDirection(idx > currentIndex ? 'next' : 'prev');
    setCurrentIndex(idx);
  }, [currentIndex]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="relative group">
      {/* Modern glassmorphism background with subtle animation */}
      <div className={`absolute -inset-4 rounded-3xl transition-all duration-700 ${
        darkMode 
          ? 'bg-gradient-to-br from-emerald-900/30 via-green-800/20 to-teal-900/30 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-green-100/60 via-emerald-50/40 to-teal-100/60'
      } ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-xl'}`} />

      <div 
        className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
          darkMode 
            ? 'bg-gray-900/50 border border-gray-700/50 shadow-2xl backdrop-blur-sm' 
            : 'bg-white/80 border border-white/50 shadow-2xl backdrop-blur-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main carousel container */}
        <div
          className="relative overflow-hidden aspect-[4/3]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image container with enhanced transitions */}
          <div
            className={`flex h-full transition-transform duration-700 ease-out ${
              direction === 'next' ? 'transform' : 'transform'
            }`}
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          >
            {images.map((img, idx) => (
              <div key={img.id} className="relative flex-shrink-0 w-full h-full">
                <ImageWithFallback
                  src={img.src}
                  alt={img.alt}
                  fallback={img.fallback}
                  index={idx}
                  currentIndex={currentIndex}
                  darkMode={darkMode}
                />
                
                {/* Enhanced gradient overlay with better typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content overlay with modern styling */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="max-w-lg space-y-3">
                    {/* Category badge */}
                    <div className="inline-flex">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        darkMode 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                          : 'bg-emerald-500/20 text-emerald-100 border border-emerald-300/30'
                      } backdrop-blur-sm`}>
                        {img.category}
                      </span>
                    </div>
                    
                    {/* Title with modern typography */}
                    <h3 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg">
                      {img.title}
                    </h3>
                    
                    {/* Description with better contrast */}
                    <p className="text-lg font-medium leading-relaxed text-gray-200 drop-shadow-sm">
                      {img.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern navigation arrows with better hover effects */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                : 'bg-white/20 hover:bg-white/40 text-white border border-white/30'
            } backdrop-blur-md hover:scale-110 active:scale-95 shadow-lg opacity-0 group-hover:opacity-100`}
          >
            <ChevronLeft />
          </button>
          
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                : 'bg-white/20 hover:bg-white/40 text-white border border-white/30'
            } backdrop-blur-md hover:scale-110 active:scale-95 shadow-lg opacity-0 group-hover:opacity-100`}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Modern indicators with enhanced styling */}
        <div className="absolute flex items-center space-x-3 -translate-x-1/2 bottom-6 left-1/2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`relative transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 h-3 bg-white shadow-lg' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75 hover:scale-110'
              } rounded-full`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === currentIndex && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced controls panel */}
        <div className="absolute flex items-center space-x-2 top-4 right-4">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-black/30 hover:bg-black/50 text-white border border-white/20' 
                : 'bg-white/30 hover:bg-white/50 text-white border border-white/30'
            } backdrop-blur-md hover:scale-110 shadow-lg opacity-60 hover:opacity-100`}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          {/* Counter with modern styling */}
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            darkMode 
              ? 'bg-black/30 text-white border border-white/20' 
              : 'bg-white/30 text-white border border-white/30'
          } backdrop-blur-md shadow-lg`}>
            <span className="font-bold">{currentIndex + 1}</span>
            <span className="mx-1 opacity-75">/</span>
            <span className="opacity-75">{images.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 to-teal-400"
            style={{ 
              width: `${((currentIndex + 1) / images.length) * 100}%`,
              transition: 'width 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ImageWithFallback({ src, alt, fallback, index, currentIndex, darkMode }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-green-100 to-emerald-100'
      }`}>
        <div className="text-center">
          <div className="mb-6 text-8xl animate-bounce">{fallback}</div>
          <h3 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {alt}
          </h3>
          <p className={`text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Fresh & Organic
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      layout="fill"
      objectFit="cover"
      priority={Math.abs(index - currentIndex) <= 1} // Preload adjacent images
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onLoadingComplete={() => setLoaded(true)}
      onError={() => setHasError(true)}
      className={`transition-all duration-700 ${
        loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}
    />
  );
}