'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface ScrollStackCard {
  id: number;
  title: string;
  description: string;
  image: string;
  badge?: string;
  ctaLabel?: string;
  href?: string;
  bgColor?: string;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  cardHeight?: number;
  stackGap?: number;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  cardHeight = 500,
  stackGap = 40
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const scrollStart = -rect.top;
        const scrollRange = container.scrollHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCardStyle = (index: number, totalCards: number) => {
    const totalScroll = totalCards - 1;
    const cardProgress = Math.max(0, scrollProgress * totalScroll - index);
    const clampedProgress = Math.min(1, cardProgress);
    
    // Scale: starts at 1, shrinks to 0.95 for stacked cards
    const scale = 1 - clampedProgress * 0.05;
    
    // Top position: starts at normal position, moves up as it gets stacked
    const topOffset = index * stackGap;
    
    // Opacity: fades out as it gets stacked
    const opacity = 1 - clampedProgress * 0.3;
    
    // Sticky positioning
    const isSticky = index < totalCards - 1;
    
    return {
      transform: `scale(${scale})`,
      opacity,
      top: isSticky ? `${topOffset}px` : 'auto',
      position: isSticky ? 'sticky' as const : 'relative' as const,
      zIndex: totalCards - index
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ 
        minHeight: `${cardHeight * cards.length + stackGap * (cards.length - 1)}px`,
        paddingTop: '60px',
        paddingBottom: '60px'
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {cards.map((card, index) => {
          const style = getCardStyle(index, cards.length);
          
          return (
            <div
              key={card.id}
              style={style}
              className="mb-8 transition-all duration-300 ease-out"
            >
              <div 
                className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ 
                  height: `${cardHeight}px`,
                  backgroundColor: card.bgColor || '#ffffff'
                }}
              >
                <div className="relative h-full w-full">
                  {/* Background Image */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                    {/* Badge */}
                    {card.badge && (
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-orange-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                          {card.badge}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {card.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                      {card.description}
                    </p>
                    
                    {/* CTA */}
                    {card.ctaLabel && (
                      <div>
                        <a
                          href={card.href || '#'}
                          className="group inline-flex items-center space-x-3 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
                        >
                          <span>{card.ctaLabel}</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollStack;
