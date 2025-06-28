// components/ImageCarousel.js
import { useState, useEffect } from 'react';

const FiChevronLeft = () => <span>‹</span>;
const FiChevronRight = () => <span>›</span>;

export default function ImageCarousel({ darkMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // ▶️ Make sure these files exist under public/images/
  const images = [
    { id: 1, src: '/images/veg.jpg', alt: 'Fresh Fish', title: 'Fresh Fish', description: 'Ocean fresh, daily catch', fallback: '🐟' },
    { id: 2, src: '/images/veg2.jpg', alt: 'Organic Fruits', title: 'Organic Fruits', description: 'Farm fresh, naturally grown', fallback: '🍎🍊🍌' },
    { id: 3, src: '/images/veg3.jpg', alt: 'Fresh Vegetables', title: 'Fresh Vegetables', description: 'Garden fresh, pesticide free', fallback: '🥕🥬🍅' },
    { id: 4, src: '/images/veg4.jpg', alt: 'Premium Meat', title: 'Premium Meat', description: 'High quality, ethically sourced', fallback: '🥩' },
    { id: 5, src: '/images/veg5.jpg', alt: 'Dairy Products', title: 'Dairy Products', description: 'Fresh milk, eggs & more', fallback: '🥛🥚' },
    { id: 6, src: '/images/veg6.jpg', alt: 'Cooking Essentials', title: 'Cooking Essentials', description: 'All your kitchen needs', fallback: '🧄🧅🌶️' }
  ];

  // Auto-slide every 4 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(iv);
  }, [images.length]);

  // Touch/swipe handlers
  const handleTouchStart = e => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const dist = touchStart - touchEnd;
    if (dist > 50) nextSlide();
    else if (dist < -50) prevSlide();
  };

  const nextSlide = () => setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
  const prevSlide = () => setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const goToSlide = idx => setCurrentIndex(idx);

  return (
    <div className="relative">
      <div className={`absolute -top-8 -left-8 w-full h-full rounded-3xl ${darkMode ? 'bg-green-800 opacity-20' : 'bg-green-200'
        }`} />

      <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${darkMode ? 'border border-gray-700' : 'border border-green-100'
        }`}>
        {/* Carousel container */}
        <div
          className="relative overflow-hidden aspect-square"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map(image => (
              <div key={image.id} className="relative flex-shrink-0 w-full h-full">
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  fallback={image.fallback}
                  darkMode={darkMode}
                />
                {/* Text overlay (improved) */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="max-w-md space-y-1">
                    <h3 className="text-3xl font-extrabold text-white drop-shadow-lg">
                      {image.title}
                    </h3>
                    <p className="text-base text-green-200/90 drop-shadow">
                      {image.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute p-3 text-white -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute p-3 text-white -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition ${idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute px-3 py-1 text-sm text-white rounded-full top-4 right-4 bg-black/30 backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

// Corrected fallback component
function ImageWithFallback({ src, alt, fallback, darkMode }) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-green-100'
        }`}>
        <div className="text-center text-white">
          <div className="mb-4 text-6xl">{fallback}</div>
          <h3 className="text-2xl font-bold">{alt}</h3>
          <p className="opacity-90">Fresh & Organic</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-green-100'
          }`}>
          <div className="text-center text-white">
            <div className="mb-4 text-6xl animate-pulse">{fallback}</div>
            <div className="w-8 h-8 mx-auto border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
          }`}
        onError={() => setHasError(true)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
