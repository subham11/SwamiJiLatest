'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ScrollSnapAnimation.module.css';

interface Section {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const sections: Section[] = [
  {
    id: 1,
    title: 'Welcome to Scroll Animations',
    description: 'Experience smooth CSS scroll-driven animations with scroll snapping. Choose an effect above to see different animation styles.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  },
  {
    id: 2,
    title: 'Scroll-Driven Animations',
    description: 'Modern CSS allows us to create animations that respond to scroll position without JavaScript. The animation timeline is tied to the scroll container.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  },
  {
    id: 3,
    title: 'Smooth Snapping',
    description: 'Each section snaps into place as you scroll, creating a polished and intentional browsing experience. This works great for storytelling and presentations.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  },
  {
    id: 4,
    title: 'Multiple Effects',
    description: 'Try different animation effects using the controls at the top. Each effect demonstrates different ways content can enter the viewport.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  },
  {
    id: 5,
    title: 'Pure CSS Magic',
    description: 'All animations are powered by modern CSS features including scroll-snap-type, animation-timeline, and view() function. No JavaScript animation libraries needed!',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  },
];

type EffectType = 'blink' | 'horizontal-scroll' | 'backwards-scroll' | 'zoom' | 'rotate' | 'fade';

interface ScrollSnapAnimationProps {
  defaultEffect?: EffectType;
  hideHeader?: boolean;
  customSections?: Section[];
  reducedHeight?: boolean;
}

export default function ScrollSnapAnimation({ defaultEffect = 'blink', hideHeader = false, customSections, reducedHeight = false }: ScrollSnapAnimationProps) {
  const [effect, setEffect] = useState<EffectType>(defaultEffect);
  const [activeSection, setActiveSection] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionsToUse = customSections || sections;

  useEffect(() => {
    // Use Intersection Observer for more accurate section detection
    const observerOptions = {
      root: wrapperRef.current,
      rootMargin: '0px',
      threshold: 0.5, // Section is considered active when 50% visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (wrapperRef.current) {
      const windowHeight = wrapperRef.current.clientHeight;
      wrapperRef.current.scrollTo({
        top: index * windowHeight,
        behavior: 'smooth',
      });
    }
  };

  const effects: { id: EffectType; label: string }[] = [
    { id: 'blink', label: 'Blink' },
    { id: 'horizontal-scroll', label: 'Horizontal Scroll' },
    { id: 'backwards-scroll', label: 'Backwards Scroll' },
    { id: 'zoom', label: 'Zoom' },
    { id: 'rotate', label: 'Rotate' },
    { id: 'fade', label: 'Fade' },
  ];

  return (
    <div className={`${styles.container} ${reducedHeight ? styles.containerReduced : ''}`} ref={containerRef}>
      {/* Component Header with Dot indicators - Outside wrapper for sticky positioning */}
      <div className={styles.componentHeader}>
        <div className={styles.dotIndicators}>
          {sectionsToUse.map((section, index) => (
            <button
              key={section.id}
              className={`${styles.dot} ${activeSection === index ? styles.active : ''}`}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to section ${index + 1}: ${section.title}`}
              data-label={`Section ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={`${styles.wrapper} ${reducedHeight ? styles.wrapperReduced : ''}`} data-effect={effect} ref={wrapperRef}>
        {!hideHeader && (
          <header className={styles.siteHeader}>
            <h1>CSS Scroll-Driven Scroll-Snapping Animations</h1>
            
            <div className={styles.fieldsetWrapper}>
              <fieldset>
                <legend className={styles.srOnly}>Effects</legend>
                {effects.map((effectOption) => (
                  <div key={effectOption.id}>
                    <input
                      type="radio"
                      id={`${effectOption.id}-effect`}
                      name="effect"
                      value={effectOption.id}
                      checked={effect === effectOption.id}
                      onChange={() => setEffect(effectOption.id)}
                      className={styles.srOnly}
                    />
                    <label htmlFor={`${effectOption.id}-effect`}>
                      {effectOption.label}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          </header>
        )}

        <main className={styles.main}>
          {sectionsToUse.map((section, index) => (
            <section
              key={section.id}
              className={styles.section}
              style={{ backgroundImage: `url(${section.imageUrl})` }}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
            >
              <div className={styles.content}>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
