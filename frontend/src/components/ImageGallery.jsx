import { useState } from 'react';

// Icons
const FiChevronLeft = () => <span>‹</span>;
const FiChevronRight = () => <span>›</span>;

export default function ImageGallery({ images, darkMode, selectedImage, setSelectedImage }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrev = () => {
    setSelectedImage(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedImage(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square flex items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm border-2 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
          : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200'
      }`}>
        <div className="text-center">
          <div className="mb-4 text-8xl animate-pulse">📦</div>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className={`relative overflow-hidden rounded-2xl aspect-square shadow-2xl backdrop-blur-sm border-2 group ${
        darkMode ? 'border-gray-600' : 'border-gray-200'
      }`}>
        <div 
          className={`w-full h-full cursor-zoom-in transition-transform duration-500 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={toggleZoom}
        >
          <img 
            src={images[selectedImage]} 
            alt={`Product ${selectedImage + 1}`}
            className="object-contain w-full h-full transition-all duration-300 hover:scale-105"
          />
        </div>
        
        {/* Image overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        
        {/* Zoom indicator */}
        <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/80 text-gray-200' 
            : 'bg-white/80 text-gray-700'
        } opacity-0 group-hover:opacity-100`}>
          🔍 Click to zoom
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full text-2xl font-bold transition-all duration-300 shadow-lg backdrop-blur-sm hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-800/80 text-white hover:bg-gray-700/90' 
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              } opacity-60 hover:opacity-100`}
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full text-2xl font-bold transition-all duration-300 shadow-lg backdrop-blur-sm hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-800/80 text-white hover:bg-gray-700/90' 
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              } opacity-60 hover:opacity-100`}
            >
              <FiChevronRight />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
            darkMode 
              ? 'bg-gray-800/80 text-gray-200' 
              : 'bg-white/90 text-gray-700'
          }`}>
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Enhanced Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            More Views
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm ${
                  selectedImage === index 
                    ? 'border-green-500 ring-4 ring-green-500/30 shadow-lg scale-105' 
                    : darkMode 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="relative w-full h-full group">
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay for selected state */}
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
                  )}
                  {/* Thumbnail overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image dots indicator for mobile */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedImage === index 
                  ? 'bg-green-500 scale-125' 
                  : darkMode 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}