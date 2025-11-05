'use client';

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { ParallaxHero } from "@/components/ParallaxHero";
import { AboutCarousel } from "@/components/AboutCarousel";
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
    <main id="main-content">
      <NavBar />
      <SwamijiHero />
      <Footer />
    </main>
  );
}

function SwamijiHero() {
  // Separate datasets: hero vs below section
  const [heroItems, setHeroItems] = useState<SwamijiItem[]>([]);
  const [aboutItems, setAboutItems] = useState<SwamijiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch JSON based on current language (supports new shape { hero:[], about:[] } with fallback to { items:[] })
  useEffect(() => {
    let mounted = true;
    const lang = i18n.language === 'hi' ? 'hi' : 'en';
    setLoading(true);
    setError(null);
  // reset state (not needed with parallax hero, but keep loading UX)
    fetch(`/content/swamiji.${lang}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const hero: SwamijiItem[] = Array.isArray(data?.hero)
          ? data.hero
          : (Array.isArray(data?.items) ? data.items : []);
        let about: SwamijiItem[] = [];
        if (Array.isArray(data?.about)) {
          about = data.about;
        } else if (data?.about && typeof data.about === 'object') {
          about = [data.about as SwamijiItem];
        }
        setHeroItems(hero);
        setAboutItems(about);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to load Swamiji content', err);
        setError(i18n.language === 'hi' ? 'सामग्री लोड करने में समस्या हुई।' : 'Failed to load content.');
        setHeroItems([]);
        setAboutItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  const slides = (heroItems.length ? heroItems : [
    { id: 0, image: '/images/SwamiJi/swami-ji-1.jpg', title: (defaultContent as any).title, description: (defaultContent as any).description }
  ]).map((it, idx) => ({
    id: it.id ?? idx,
    image: it.image,
    title: it.title,
    subtitle: (it as any).subtitle,
    description: it.description,
  }));

  // About section state: reveal text after image load
  const [aboutImgLoaded, setAboutImgLoaded] = useState<boolean>(false);
  const [aboutShowText, setAboutShowText] = useState<boolean>(false);

  // About content: prefer the 5th item from fetched JSON, else fallback
  const aboutItem: SwamijiItem | { title: string; description: string; image: string } =
    (aboutItems[0] ? aboutItems[0] as SwamijiItem : undefined) ||
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
    {/* Page-level content loader while JSON is loading */}
    <PageLoader active={loading} message={i18n.language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'} />
    <ParallaxHero
      slides={slides}
      height="85vh"
      autoplayMs={5000}
    />
    {/* About Swamiji Section */}
    {aboutItems.length > 1 ? (
      <AboutCarousel items={aboutItems} />
    ) : (
      <section className="container aboutSwamiji">
        <div className="aboutImageWrap" style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            opacity: aboutImgLoaded ? 1 : 0,
            transform: aboutImgLoaded ? 'none' : 'translateY(16px) scale(0.98)',
            transition: 'opacity 700ms ease, transform 700ms ease',
        }}>
          <img
            src={aboutItem.image}
            alt={typeof aboutItem.title === 'string' ? aboutItem.title : 'Swamiji'}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              border: '4px solid var(--color-primary)'
            }}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              setAboutImgLoaded(true);
              setTimeout(() => setAboutShowText(true), 350);
            }}
            onError={() => {
              setAboutImgLoaded(true);
              setTimeout(() => setAboutShowText(true), 350);
            }}
          />
        </div>

        <div className="aboutText" style={{
            opacity: aboutShowText ? 1 : 0,
            transform: aboutShowText ? 'none' : 'translateY(10px)',
            transition: 'opacity 700ms ease, transform 700ms ease',
        }}>
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
    )}
    </>
  );
}
