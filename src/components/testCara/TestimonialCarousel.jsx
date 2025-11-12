'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const TestimonialCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Testimonial data based on the video
  const testimonials = [
    {
      id: 1,
      company: "Epic Games",
      logo: "/logos/epic-games-logo.svg", // You'll need to add these logos
      headline: "AWS is how Epic Games lets you battle 100 million frenemies",
      backgroundImage: "/images/epic-games-bg.jpg", // Add background images
      bgAlt: "Epic Games office environment"
    },
    {
      id: 2,
      company: "Philips",
      logo: "/logos/philips-logo.svg",
      headline: "AWS is how Philips helps doctors see the full picture",
      backgroundImage: "/images/philips-bg.jpg",
      bgAlt: "Philips medical office environment"
    },
    {
      id: 3,
      company: "Canva",
      logo: "/logos/canva-logo.svg",
      headline: "AWS is how Canva empowers your business to design",
      backgroundImage: "/images/canva-bg.jpg",
      bgAlt: "Canva office with yoga studio"
    },
    {
      id: 4,
      company: "BMW Group",
      logo: "/logos/bmw-logo.svg",
      headline: "AWS is how BMW helps you park with a tap",
      backgroundImage: "/images/bmw-bg.jpg",
      bgAlt: "BMW car in modern parking garage"
    }
  ];

  // FAQ/Features data
  const features = [
    {
      title: "Fast-track adoption of new industry-first innovations",
      content: "Accelerate your business with cutting-edge cloud technologies and industry-leading solutions."
    },
    {
      title: "Trust your sensitive workloads to the most secure cloud",
      content: "Enterprise-grade security and compliance to protect your most critical data and applications."
    },
    {
      title: "Scale with confidence and control costs",
      content: "Flexible scaling options with transparent pricing and cost optimization tools."
    }
  ];

  const [expandedFeature, setExpandedFeature] = useState(null);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Carousel Section */}
      <div className="relative h-screen">
        {/* Main Carousel */}
        <div className="relative h-full overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className="relative h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={testimonial.backgroundImage}
                    alt={testimonial.bgAlt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
                  <div className="max-w-3xl">
                    {/* Company Logo */}
                    <div className="mb-8">
                      <Image
                        src={testimonial.logo}
                        alt={`${testimonial.company} logo`}
                        width={120}
                        height={60}
                        className="h-12 w-auto object-contain brightness-0 invert"
                      />
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-8">
                      {testimonial.headline}
                    </h2>

                    {/* Arrow */}
                    <div className="inline-flex items-center text-white">
                      <svg 
                        className="w-6 h-6" 
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20">
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => 
            prev === 0 ? testimonials.length - 1 : prev - 1
          )}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Why AWS Section */}
      <div className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Description */}
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">
                Why AWS?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Amazon Web Services is the world's most comprehensive and broadly adopted cloud, 
                enabling customers to build virtually anything with over 200 fully featured services. 
                Whether you're a startup or a Global 2000 company, join millions of customers who 
                trust AWS to power their infrastructure.
              </p>
            </div>

            {/* Right Column - Expandable Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleFeature(index)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </span>
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
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFeature === index ? 'max-h-40 pb-6' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {feature.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;