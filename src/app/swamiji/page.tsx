'use client';

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type SwamijiItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  subtitle?: string;
};

export default function SwamijiPage() {
  return (
    <main>
      <NavBar />
      <SwamijiHero />
      <Footer />
    </main>
  );
}

function SwamijiHero() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [items, setItems] = useState<SwamijiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [imagesShow, setImagesShow] = useState<boolean>(false);
  const { i18n } = useTranslation();

  // Compute default content based on language
  const defaultContent = useMemo(() => (
    i18n.language === 'hi'
      ? {
          title: "स्वामी रुपेश्वरानंद",
          description:
            "एक आध्यात्मिक मार्गदर्शक जो प्राचीन वैदिक परंपराओं और पवित्र शिक्षाओं के माध्यम से दिव्य ज्ञान फैलाने और साधकों को ज्ञान के मार्ग पर ले जाने के लिए समर्पित हैं।",
        }
      : {
          title: "Swami Rupeshwaranand",
          description:
            "A spiritual guide dedicated to spreading divine wisdom and leading seekers on the path of enlightenment through ancient Vedic traditions and sacred teachings.",
        }
  ), [i18n.language]);

  // Fetch JSON based on current language
  useEffect(() => {
    let mounted = true;
    const lang = i18n.language === 'hi' ? 'hi' : 'en';
    setLoading(true);
    setError(null);
    setLoadedCount(0);
    setImagesShow(false);
    fetch(`/content/swamiji.${lang}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const parsed: SwamijiItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems(parsed);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to load Swamiji content', err);
        setError(i18n.language === 'hi' ? 'सामग्री लोड करने में समस्या हुई।' : 'Failed to load content.');
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  // Safety fallback: if images don't report load, reveal text after a timeout
  useEffect(() => {
    if (!items.length) return;
    const maxDelay = 3500; // ms
    const timer = setTimeout(() => setImagesShow(true), maxDelay);
    return () => clearTimeout(timer);
  }, [items]);

  const currentContent = hoveredImage !== null && items[hoveredImage]
    ? items[hoveredImage]
    : defaultContent;

  // About section state: reveal text after image load
  const [aboutImgLoaded, setAboutImgLoaded] = useState<boolean>(false);
  const [aboutShowText, setAboutShowText] = useState<boolean>(false);

  // About content: prefer the 5th item from fetched JSON, else fallback
  const aboutItem: SwamijiItem | { title: string; description: string; image: string } =
    items[4] ||
    (i18n.language === 'hi'
      ? {
          title: 'स्वामीजी के बारे में',
          description:
            'स्वामी रुपेश्वरानंद जी आध्यात्मिक साधना, वेदांत व भक्ति मार्ग के माध्यम से साधकों का मार्गदर्शन करते हैं और जीवन में शांति, करुणा व ज्ञान का संचार करते हैं।',
          image: '/images/SwamiJi/swami-ji-5.jpg',
        }
      : {
          title: 'About Swamiji',
          description:
            'Swami Rupeshwaranand guides seekers through spiritual practice rooted in Vedanta and devotion, inspiring a life of peace, compassion, and wisdom.',
          image: '/images/SwamiJi/swami-ji-5.jpg',
        });

  // Ensure About section doesn't get stuck hidden (e.g., cached image events)
  useEffect(() => {
    // Reset when image source changes
    setAboutImgLoaded(false);
    setAboutShowText(false);
    const timer = setTimeout(() => {
      if (!aboutImgLoaded) {
        setAboutImgLoaded(true);
        setAboutShowText(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutItem.image]);

  return (
    <>
    <div className="heroFullBleed" id="swamiji">
      {/* Page-level content loader while JSON is loading */}
      <PageLoader active={loading} message={i18n.language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'} />
      <div className="heroOverlapContainer">
        <div className="heroOverlapImages">
          {items.map((item, index) => {
            const baseTransform = `translateX(${index * 80}px) rotate(${(index - 2) * 3}deg)`;
            const transform = imagesShow
              ? baseTransform
              : `${baseTransform} translateY(20px) scale(0.98)`;
            const delayMs = index * 120; // stagger entry
            return (
            <div 
              key={item.id} 
              className={`heroOverlapImage ${hoveredImage === index ? 'hovered' : ''}`}
              style={{
                transform,
                opacity: imagesShow ? 1 : 0,
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: `${delayMs}ms`,
                zIndex: hoveredImage === index ? 100 : index + 1,
              }}
              onMouseEnter={() => setHoveredImage(index)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src={item.image}
                alt={`Swami Ji ${index + 1}`}
                onLoad={() => {
                  setLoadedCount((c) => {
                    const next = c + 1;
                    if (next >= items.length) {
                      // Reveal images + schedule text after last image delay
                      setImagesShow(true);
                    }
                    return next;
                  });
                }}
                onError={() => {
                  // Treat error as loaded to avoid blocking animation
                  setLoadedCount((c) => {
                    const next = c + 1;
                    if (next >= items.length) setImagesShow(true);
                    return next;
                  });
                }}
              />
            </div>
            );
          })}
        </div>
        {(() => {
          const textDelayMs = (items.length > 0 ? (items.length - 1) * 120 : 0) + 400;
          return (
            <div
              className="heroContent"
              style={{
                opacity: imagesShow ? 1 : 0,
                transform: imagesShow ? 'none' : 'translateY(10px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                transitionDelay: imagesShow ? `${textDelayMs}ms` : '0ms',
              }}
            >
          <h1 className="heroTitle heroTitleAnimated" key={currentContent.title}>
            {currentContent.title}
          </h1>
          <p className="swamijiDescription swamijiDescriptionAnimated" key={currentContent.description}>
            {currentContent.description}
          </p>
          {error && (
            <p style={{ color: '#f87171', marginTop: '0.75rem' }}>{error}</p>
          )}
            </div>
          );
        })()}
      </div>
    </div>

    {/* About Swamiji Section */}
    <section
      className="container"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '2rem',
        alignItems: 'center',
        padding: '3rem 1rem',
      }}
    >
      {/* (Badge heading removed as requested) */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          opacity: aboutImgLoaded ? 1 : 0,
          transform: aboutImgLoaded ? 'none' : 'translateY(16px) scale(0.98)',
          transition: 'opacity 700ms ease, transform 700ms ease',
        }}
      >
        <img
          src={aboutItem.image}
          alt={typeof aboutItem.title === 'string' ? aboutItem.title : 'Swamiji'}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            border: '4px solid var(--color-primary)'
          }}
          onLoad={() => {
            setAboutImgLoaded(true);
            // Reveal text with a slight delay after image appears
            setTimeout(() => setAboutShowText(true), 350);
          }}
          onError={() => {
            // Fallback if image fails to load
            setAboutImgLoaded(true);
            setTimeout(() => setAboutShowText(true), 350);
          }}
        />
      </div>

      <div
        style={{
          opacity: aboutShowText ? 1 : 0,
          transform: aboutShowText ? 'none' : 'translateY(10px)',
          transition: 'opacity 700ms ease, transform 700ms ease',
        }}
      >
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', marginBottom: '0.25rem' }}>
          {typeof aboutItem.title === 'string' ? aboutItem.title : (i18n.language === 'hi' ? 'स्वामीजी के बारे में' : 'About Swamiji')}
        </h2>
        {typeof (aboutItem as any).subtitle === 'string' && (
          <div style={{
            fontSize: 'clamp(1.25rem, 2.2vw, 2rem)',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            {(aboutItem as any).subtitle}
          </div>
        )}
        {typeof aboutItem.description === 'string' && aboutItem.description.split('\n').map((para, idx) => (
          <p key={idx} style={{ fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.65, marginTop: idx === 0 ? '0.25rem' : '0.75rem' }}>
            {para}
          </p>
        ))}
      </div>
    </section>
    </>
  );
}
