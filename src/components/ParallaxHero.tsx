'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y } from 'swiper/modules';
import { useState, useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import LetterGlitch from '@/components/effects/LetterGlitch';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Slide = {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
};

type Props = {
  slides: Slide[];
  height?: string; // e.g., '100vh'
  autoplayMs?: number;
};

function ParallaxSlideContent({ slide, isActive, onScanComplete, index }: { slide: Slide; isActive: boolean; onScanComplete: (idx: number) => void; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showText, setShowText] = useState(false);
  const [startGlitch, setStartGlitch] = useState(false);
  const [scanTargets, setScanTargets] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(0);
  const notifiedRef = useRef(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Trigger animations when slide becomes active
  useEffect(() => {
    if (isActive && imageLoaded) {
      // Start image fade-in
      setTimeout(() => setShowImage(true), 100);
      // Then text fade-in after image animation
      setTimeout(() => {
        setShowText(true);
        setStartGlitch(true);
      }, 900);
    } else if (!isActive) {
      // Reset when slide is not active
      setShowImage(false);
      setShowText(false);
      setStartGlitch(false);
      setScanCompleted(0);
      notifiedRef.current = false;
    }
  }, [isActive, imageLoaded]);

  // Determine how many scan elements we have (title + optional subtitle + optional description)
  useEffect(() => {
    const count = 1 + (slide.subtitle ? 1 : 0) + (slide.description ? 1 : 0);
    setScanTargets(count);
  }, [slide.subtitle, slide.description]);

  // When all scans complete, notify parent once
  useEffect(() => {
    if (isActive && showText && scanTargets > 0 && scanCompleted >= scanTargets && !notifiedRef.current) {
      notifiedRef.current = true;
      onScanComplete(index);
    }
  }, [scanCompleted, scanTargets, isActive, showText, onScanComplete, index]);

  return (
    <div className="parallaxSlide">
      <div className="parallaxImageContainer">
        <img 
          src={slide.image} 
          alt={slide.title} 
          className={`parallaxImage ${showImage ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? undefined : 0 }}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isActive && index === 0 ? 'high' : 'low'}
        />
      </div>
      <div className="parallaxTextContainer">
        <div className={`parallaxContent ${showText ? 'show' : ''}`}>
          <div className="gridScanWrapper" style={{ ['--scan-duration' as any]: '1200ms' }}>
            <h2 className="parallaxTitle">
              <LetterGlitch text={slide.title} start={startGlitch} speed={14} settleDuration={700} />
            </h2>
            <span className="gridScanner" onAnimationEnd={() => setScanCompleted((c) => c + 1)} />
          </div>
          {slide.subtitle && (
            <div className="gridScanWrapper" style={{ ['--scan-duration' as any]: '1000ms' }}>
              <div className="parallaxSubtitle">
                <LetterGlitch text={slide.subtitle || ''} start={startGlitch} speed={16} settleDuration={600} />
              </div>
              <span className="gridScanner" onAnimationEnd={() => setScanCompleted((c) => c + 1)} />
            </div>
          )}
          {slide.description && (
            <div className="gridScanWrapper" style={{ ['--scan-duration' as any]: '900ms' }}>
              <p className="parallaxText">
                <LetterGlitch text={slide.description || ''} start={startGlitch} speed={18} settleDuration={500} />
              </p>
              <span className="gridScanner" onAnimationEnd={() => setScanCompleted((c) => c + 1)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParallaxHero({ slides, height = '100vh', autoplayMs = 5000 }: Props){
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const timerRef = useRef<number | null>(null);

  // Start a 6s timer after scan completes on active slide
  const handleScanCompleteFromChild = (idx: number) => {
    if (idx !== activeIndex) return;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      if (swiperRef.current && swiperRef.current.realIndex === activeIndex) {
        swiperRef.current.slideNext();
      }
    }, 6000);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className="parallaxHero" style={{ height }}>
      <Swiper
        modules={[Pagination, Navigation, A11y]}
        navigation
        pagination={{ clickable: true }}
        speed={1200}
        loop
        onSlideChange={(swiper) => {
          // Clear pending timers when slide changes
          if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          handleSlideChange(swiper);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        style={{ width:'100%', height:'100%' }}
      >
        {slides.map((s, index) => (
          <SwiperSlide key={s.id}>
            <ParallaxSlideContent slide={s} isActive={index === activeIndex} index={index} onScanComplete={handleScanCompleteFromChild} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default ParallaxHero;
