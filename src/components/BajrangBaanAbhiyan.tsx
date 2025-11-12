'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BajrangBaanSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  category: string;
}

// Using SwamiJi imagery for stronger thematic resonance
const bajrangBaanSlides: BajrangBaanSlide[] = [
  {
    id: 1,
    image: '/images/SwamiJi/swami-ji-1.jpg',
    title: 'Daily Bajrang Baan Recitation',
    description: 'Begin the day with collective invocation – a powerful daily practice guided by SwamiJi\'s blessings.',
    category: 'Daily Practice',
  },
  {
    id: 2,
    image: '/images/SwamiJi/swami-ji-2.jpg',
    title: 'Global Bajrang Baan Marathon',
    description: 'Unified chanting across continents – experience the global spiritual wave in real-time.',
    category: 'Global Event',
  },
  {
    id: 3,
    image: '/images/SwamiJi/swami-ji-3.jpg',
    title: 'Hanuman Chalisa Integration',
    description: 'A synergistic recitation flow combining Bajrang Baan and Hanuman Chalisa for amplified devotion.',
    category: 'Advanced Practice',
  },
  {
    id: 4,
    image: '/images/SwamiJi/swami-ji-4.jpg',
    title: 'Youth Empowerment Program',
    description: 'Introducing the younger generation to disciplined, heart-centered devotional practice.',
    category: 'Youth Program',
  },
  {
    id: 5,
    image: '/images/SwamiJi/swami-ji-5.jpg',
    title: 'Online Learning Sessions',
    description: 'Interactive pronunciation, meaning, and rhythm workshops streamed globally.',
    category: 'Education',
  },
  {
    id: 6,
    image: '/images/SwamiJi/swami-ji-6.jpg',
    title: 'Community Gathering',
    description: 'Local satsang circles strengthening collective energy and devotional fellowship.',
    category: 'Community',
  },
  {
    id: 7,
    image: '/images/SwamiJi/swami-ji-2.jpg',
    title: 'Personal Transformation',
    description: 'Stories of inner strength, clarity, and devotion emerging through sustained practice.',
    category: 'Stories',
  },
];

export default function BajrangBaanAbhiyan() {
  const [slideStates, setSlideStates] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize slide states
    setSlideStates(bajrangBaanSlides.map(() => ''));

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      slideRefs.current.forEach((slideEl, index) => {
        if (!slideEl) return;

        const slideTop = slideEl.offsetTop;
        const slideHeight = slideEl.offsetHeight;
        const slideBottom = slideTop + slideHeight;

        // Determine if slide should be fixed
        if (scrollTop >= slideTop && scrollTop < slideBottom - windowHeight) {
          setSlideStates(prev => {
            const newStates = [...prev];
            newStates[index] = 'fixed';
            return newStates;
          });
        } else {
          setSlideStates(prev => {
            const newStates = [...prev];
            newStates[index] = '';
            return newStates;
          });
        }
      });
    };

    const onScroll = () => {
      if (typeof window.requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(handleScroll);
      } else {
        handleScroll();
      }
    };

    window.addEventListener('scroll', onScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="bajrangBaanSection" ref={containerRef}>
      <div className="bajrangBaanHeader">
        <h2 className="sectionTitle">Shri Bajrang Baan Abhiyan</h2>
        <p className="sectionSubtitle">
          Experience the divine power and spiritual transformation through our sacred Bajrang Baan programs
        </p>
        <p className="sectionHint">Scroll down to explore our programs</p>
      </div>

      <div className="bajrangBaanSlider">
        {bajrangBaanSlides.map((slide, index) => (
          <div key={slide.id}>
            {/* Main slide */}
            <div
              ref={el => { slideRefs.current[index] = el; }}
              className={`parallaxSlide ${slideStates[index]}`}
              style={{ zIndex: 100 + index }}
            >
              <div className="slideCard">
                {/* Card background image */}
                <Image
                  src={slide.image}
                  alt={`${slide.title} - ${slide.category}`}
                  fill
                  className="slideCardImage"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1200px"
                  priority={index < 2}
                />
                <div className="slideCardOverlay" />
                <div className="slideCardContent">
                  <span className="slideBadge">{slide.category}</span>
                  <h3 className="slideHeading">{slide.title}</h3>
                  <p className="slideSub">{slide.description}</p>
                  <button className="slideCta" aria-label={`Learn more about ${slide.title}`}>
                    <span>Learn more</span>
                    <span className="slideCtaArrow">→</span>
                  </button>
                </div>
              </div>

              {/* Decorative stacked bars to mimic AWS layered base */}
              <div className="slideStack" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="slideNumber">0{index + 1}</div>
            </div>

            {/* Fake height spacer for scroll */}
            {index < bajrangBaanSlides.length - 1 && (
              <div className="slideSpacer"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
