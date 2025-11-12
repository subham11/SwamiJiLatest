'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const EnhancedTestimonialCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const intervalRef = useRef(null);

  // Testimonial data with enhanced structure
  const testimonials = [
    {
      id: 1,
      company: "Epic Games",
      logo: "/logos/epic-games-logo.svg",
      headline: "AWS is how Epic Games lets you battle 100 million frenemies",
      description: "Supporting massive multiplayer gaming infrastructure",
      backgroundImage: "/images/epic-games-bg.jpg",
      bgAlt: "Epic Games office environment",
      color: "#FF6B35" // Epic Games brand color
    },
    {
      id: 2,
      company: "Philips",
      logo: "/logos/philips-logo.svg",
      headline: "AWS is how Philips helps doctors see the full picture",
      description: "Enhancing healthcare with cloud-powered medical imaging",
      backgroundImage: "/images/philips-bg.jpg",
      bgAlt: "Philips medical office environment",
      color: "#0066CC" // Philips brand color
    },
    {
      id: 3,
      company: "Canva",
      logo: "/logos/canva-logo.svg",
      headline: "AWS is how Canva empowers your business to design",
      description: "Scaling creative platforms for millions of users",
      backgroundImage: "/images/canva-bg.jpg",
      bgAlt: "Canva office with modern workspace",
      color: "#00C4CC" // Canva brand color
    },
    {
      id: 4,
      company: "BMW Group",
      logo: "/logos/bmw-logo.svg",
      headline: "AWS is how BMW helps you park with a tap",
      description: "Revolutionizing automotive experiences through IoT",
      backgroundImage: "/images/bmw-bg.jpg",
      bgAlt: "BMW car in modern parking garage",
      color: "#1C69D4" // BMW brand color
    }
  ];

  // Enhanced features data
  const features = [
    {
      title: "Fast-track adoption of new industry-first innovations",
      content: "Accelerate your business with cutting-edge cloud technologies and industry-leading solutions. Get access to the latest AI/ML services, serverless computing, and emerging technologies.",
      icon: "🚀",
      stats: "200+ Services"
    },
    {
      title: "Trust your sensitive workloads to the most secure cloud",
      content: "Enterprise-grade security and compliance to protect your most critical data and applications. SOC, ISO, and PCI DSS certified with 99.99% uptime SLA.",
      icon: "🛡️",
      stats: "99.99% Uptime"
    },
    {
      title: "Scale with confidence and control costs",
      content: "Flexible scaling options with transparent pricing and cost optimization tools. Pay only for what you use with no upfront costs or long-term commitments.",
      icon: "📈",
      stats: "40% Cost Savings"
    }
  ];

  const [expandedFeature, setExpandedFeature] = useState(null);

  // Preload images
  useEffect(() => {
    testimonials.forEach((testimonial, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.src = testimonial.backgroundImage;
    });
  }, []);

  // Enhanced auto-rotation with play/pause
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 6000); // Slightly longer interval
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, testimonials.length]);

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  }, [testimonials.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isPlaying]);

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Carousel Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background with enhanced parallax effect */}
        <div className="absolute inset-0">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              {loadedImages.has(index) && (
                <Image
                  src={testimonial.backgroundImage}
                  alt={testimonial.bgAlt}
                  fill
                  className="object-cover transition-transform duration-[10000ms] ease-out hover:scale-110"
                  priority={index === 0}
                />
              )}
              {/* Enhanced gradient overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`
                }}
              />
            </div>
          ))}
        </div>

        {/* Content with enhanced animations */}
        <div 
          className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="max-w-4xl">
            {/* Company Logo with animation */}
            <div className="mb-8 transform transition-all duration-700 delay-300">
              <div className="relative inline-block">
                <Image
                  src={currentTestimonial.logo}
                  alt={`${currentTestimonial.company} logo`}
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain brightness-0 invert transition-all duration-500 hover:scale-105"
                />
                {/* Subtle glow effect */}
                <div 
                  className="absolute inset-0 blur-md opacity-30 transition-all duration-500"
                  style={{ backgroundColor: currentTestimonial.color }}
                />
              </div>
            </div>

            {/* Enhanced Headline */}
            <div className="mb-6 transform transition-all duration-700 delay-500">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[0.9] mb-4">
                {currentTestimonial.headline}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                {currentTestimonial.description}
              </p>
            </div>

            {/* Enhanced CTA with arrow */}
            <div className="transform transition-all duration-700 delay-700">
              <button className="group inline-flex items-center space-x-3 text-white hover:text-gray-200 transition-colors">
                <span className="text-lg font-medium">Learn more</span>
                <div className="relative">
                  <svg 
                    className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                  {/* Arrow trail effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg 
                      className="w-6 h-6 -translate-x-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20">
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Enhanced Indicators */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative group"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div 
                    className={`w-10 h-1 rounded-full transition-all duration-500 ${
                      index === currentSlide 
                        ? 'bg-white scale-110' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                  {/* Progress bar for current slide */}
                  {index === currentSlide && isPlaying && (
                    <div 
                      className="absolute top-0 left-0 h-1 bg-white/60 rounded-full transition-all duration-75"
                      style={{
                        width: '100%',
                        animation: 'progress 6s linear infinite'
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Enhanced Why AWS Section */}
      <div className="py-24 px-8 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left Column - Enhanced Description */}
            <div className="lg:sticky lg:top-24">
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
                Why AWS?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Amazon Web Services is the world's most comprehensive and broadly adopted cloud, 
                enabling customers to build virtually anything with over 200 fully featured services.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.99%</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">190</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Expandable Features */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFeature(index)}
                    className="w-full p-6 flex items-center justify-between text-left group bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {feature.title}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">
                          {feature.stats}
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                        expandedFeature === index ? 'rotate-45' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-500 bg-gray-50 ${
                      expandedFeature === index ? 'max-h-48 border-t border-gray-200' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6">
                      <p className="text-gray-600 leading-relaxed">
                        {feature.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedTestimonialCarousel;