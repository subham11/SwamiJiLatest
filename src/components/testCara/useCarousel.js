'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for carousel functionality
 * Provides all the logic needed for a carousel with auto-rotation, navigation, and touch support
 */
export const useCarousel = ({
  itemCount,
  autoPlay = true,
  interval = 5000,
  enableTouch = true,
  enableKeyboard = true,
  loop = true
} = {}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const intervalRef = useRef(null);

  const minSwipeDistance = 50;

  // Auto-rotation logic
  useEffect(() => {
    if (isPlaying && autoPlay && itemCount > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (loop) {
            return (prev + 1) % itemCount;
          } else {
            return prev === itemCount - 1 ? 0 : prev + 1;
          }
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlay, itemCount, interval, loop]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < itemCount) {
      setCurrentIndex(index);
    }
  }, [itemCount]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev + 1) % itemCount;
      } else {
        return prev === itemCount - 1 ? prev : prev + 1;
      }
    });
  }, [itemCount, loop]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) {
        return prev === 0 ? itemCount - 1 : prev - 1;
      } else {
        return prev === 0 ? prev : prev - 1;
      }
    });
  }, [itemCount, loop]);

  const togglePlayState = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    if (!enableTouch) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [enableTouch]);

  const handleTouchMove = useCallback((e) => {
    if (!enableTouch) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [enableTouch]);

  const handleTouchEnd = useCallback(() => {
    if (!enableTouch || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  }, [enableTouch, touchStart, touchEnd, goToNext, goToPrevious]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          togglePlayState();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(itemCount - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, goToPrevious, goToNext, togglePlayState, goToSlide, itemCount]);

  // Mouse enter/leave handlers for auto-pause
  const handleMouseEnter = useCallback(() => {
    if (autoPlay) {
      pause();
    }
  }, [autoPlay, pause]);

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) {
      play();
    }
  }, [autoPlay, play]);

  // Progress calculation for current slide
  const progress = ((currentIndex + 1) / itemCount) * 100;

  // Check if at boundaries (useful for non-loop carousels)
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === itemCount - 1;

  return {
    // State
    currentIndex,
    isPlaying,
    progress,
    isAtStart,
    isAtEnd,

    // Actions
    goToSlide,
    goToNext,
    goToPrevious,
    togglePlayState,
    pause,
    play,

    // Event handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,

    // Utils
    setCurrentIndex,
    setIsPlaying
  };
};

/**
 * Hook for preloading images
 * Useful for carousel components with background images
 */
export const useImagePreloader = (imageUrls = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loadingErrors, setLoadingErrors] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    const loadImage = (url, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
          resolve({ index, success: true });
        };
        
        img.onerror = () => {
          setLoadingErrors(prev => new Set([...prev, index]));
          resolve({ index, success: false });
        };
        
        img.src = url;
      });
    };

    const loadAllImages = async () => {
      setIsLoading(true);
      
      const promises = imageUrls.map((url, index) => loadImage(url, index));
      await Promise.all(promises);
      
      setIsLoading(false);
    };

    loadAllImages();
  }, [imageUrls]);

  const isImageLoaded = (index) => loadedImages.has(index);
  const hasImageError = (index) => loadingErrors.has(index);
  const getLoadedCount = () => loadedImages.size;
  const getErrorCount = () => loadingErrors.size;
  const getTotalCount = () => imageUrls.length;
  const getLoadProgress = () => {
    const total = getTotalCount();
    if (total === 0) return 100;
    return (getLoadedCount() / total) * 100;
  };

  return {
    loadedImages,
    loadingErrors,
    isLoading,
    isImageLoaded,
    hasImageError,
    getLoadedCount,
    getErrorCount,
    getTotalCount,
    getLoadProgress
  };
};

/**
 * Hook for smooth scrolling animations
 * Can be used to enhance carousel transitions
 */
export const useSmoothTransition = (duration = 300) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, duration);
  }, [duration]);

  return {
    isTransitioning,
    startTransition
  };
};

/**
 * Hook for intersection observer
 * Useful for lazy loading carousel content or pause when not visible
 */
export const useIntersectionObserver = (
  elementRef,
  options = { threshold: 0.5 }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Export all hooks
export default {
  useCarousel,
  useImagePreloader,
  useSmoothTransition,
  useIntersectionObserver
};