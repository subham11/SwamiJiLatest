'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Import custom styles
import styles from './BajrangBaanCarousel.module.css';

interface BajrangBaanSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  ctaLabel?: string;
  href?: string;
}

interface BajrangBaanCarouselProps {
  slides?: BajrangBaanSlide[];
  autoPlay?: boolean;
  interval?: number;
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
}

const defaultSlides: BajrangBaanSlide[] = [
  {
    id: 1,
    title: "Hanuman Chalisa Recitation",
    description: "Join millions in daily recitation of sacred verses",
    image: "/images/SwamiJi/swami-ji-1.jpg",
    badge: "Daily Practice",
    ctaLabel: "Learn More",
    href: "#"
  },
  {
    id: 2,
    title: "Spiritual Gatherings",
    description: "Connect with devotees in divine assemblies",
    image: "/images/SwamiJi/swami-ji-2.jpg",
    badge: "Community",
    ctaLabel: "Join Us",
    href: "#"
  },
  {
    id: 3,
    title: "Sacred Teachings",
    description: "Explore ancient wisdom and spiritual guidance",
    image: "/images/SwamiJi/swami-ji-3.jpg",
    badge: "Knowledge",
    ctaLabel: "Discover",
    href: "#"
  },
  {
    id: 4,
    title: "Meditation Sessions",
    description: "Find inner peace through guided meditation",
    image: "/images/SwamiJi/swami-ji-4.jpg",
    badge: "Practice",
    ctaLabel: "Begin Journey",
    href: "#"
  },
  {
    id: 5,
    title: "Devotional Music",
    description: "Experience divine bliss through sacred melodies",
    image: "/images/SwamiJi/swami-ji-5.jpg",
    badge: "Bhajan",
    ctaLabel: "Listen Now",
    href: "#"
  },
  {
    id: 6,
    title: "Seva Programs",
    description: "Serve humanity with compassion and devotion",
    image: "/images/SwamiJi/swami-ji-6.jpg",
    badge: "Service",
    ctaLabel: "Participate",
    href: "#"
  }
];

const BajrangBaanCarousel: React.FC<BajrangBaanCarouselProps> = ({
  slides = defaultSlides,
  autoPlay = true,
  interval = 6000,
  effect = 'fade'
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, Keyboard]}
        effect={effect}
        speed={1000}
        loop={true}
        autoplay={autoPlay ? {
          delay: interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          renderBullet: (index, className) => {
            return `<button class="${className} ${styles.swiperBulletCustom}" aria-label="Go to slide ${index + 1}"></button>`;
          }
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
                <div className="max-w-4xl">
                  {/* Badge */}
                  {slide.badge && (
                    <div className={`mb-6 ${styles.animateFadeIn}`}>
                      <span className="inline-block px-4 py-2 bg-orange-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                        {slide.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 ${styles.animateSlideUp}`}>
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className={`text-lg md:text-xl text-white/90 max-w-2xl mb-8 ${styles.animateSlideUp} ${styles.animationDelay200}`}>
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  {slide.ctaLabel && (
                    <div className={`${styles.animateSlideUp} ${styles.animationDelay400}`}>
                      <a
                        href={slide.href}
                        className="group inline-flex items-center space-x-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <span>{slide.ctaLabel}</span>
                        <svg 
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
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
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group cursor-pointer"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group cursor-pointer"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Custom Pagination with Play/Pause */}
      <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20">
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={() => {
              if (swiperRef.current) {
                if (swiperRef.current.autoplay.running) {
                  swiperRef.current.autoplay.stop();
                } else {
                  swiperRef.current.autoplay.start();
                }
              }
            }}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30"
            aria-label="Toggle autoplay"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="swiper-pagination-custom flex space-x-2"></div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 text-white font-medium backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
        <span className="swiper-counter-current text-2xl">1</span>
        <span className="text-white/60"> / {slides.length}</span>
      </div>
    </div>
  );
};

export default BajrangBaanCarousel;
