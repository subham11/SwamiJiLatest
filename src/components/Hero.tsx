'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

type Locale = 'en' | 'hi';

interface HeroContent {
  slides: string[]; // expect 5 entries
  cta: string;
}

// Default content (used as fallback)
const defaultContent: Record<Locale, HeroContent> = {
  en: {
    slides: [
      'Divine Guidance For Modern Life',
      'Daily Inspirations & Teachings',
      'Path to Inner Peace',
      'Ancient Wisdom for Today',
      'Spiritual Awakening Awaits'
    ],
    cta: 'Explore Now'
  },
  hi: {
    slides: [
      'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
      'दैनिक प्रेरणाएँ और उपदेश',
      'आंतरिक शांति का मार्ग',
      'आज के लिए प्राचीन ज्ञान',
      'आध्यात्मिक जागृति आपका इंतज़ार कर रही है'
    ],
    cta: 'अभी देखें'
  }
};

function normalizeSlides(raw: unknown, locale: Locale): string[] {
  const fallback = defaultContent[locale].slides;
  if (Array.isArray(raw)) {
    const cleaned = raw
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      .map((s) => s.trim());
    if (cleaned.length) {
      const count = 5;
      return Array.from({ length: count }, (_v, i) => cleaned[i] ?? cleaned[i % cleaned.length] ?? fallback[i]);
    }
  }
  return fallback;
}

function normalizeContent(data: any, locale: Locale): HeroContent {
  const slidesSource = data?.slides ?? [data?.slide1, data?.slide2];
  const slides = normalizeSlides(slidesSource, locale);
  const cta = typeof data?.cta === 'string' && data.cta.trim() ? data.cta : defaultContent[locale].cta;
  return { slides, cta };
}

const heroSlideImages = [
  '/images/TempleImages/Temple_01.jpeg',
  '/images/TempleImages/Temple_02.jpeg',
  '/images/TempleImages/Temple_03.jpeg',
  '/images/TempleImages/Temple_04.jpeg',
  '/images/TempleImages/Temple_05.jpeg',
];

export function Hero(){
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<HeroContent>(defaultContent.en);
  
  useEffect(() => {
    const fetchHeroContent = async () => {
      const locale: Locale = i18n.language?.startsWith('hi') ? 'hi' : 'en';
      try {
        const res = await fetch(`/api/page-content/${locale}/home/hero`, {
          next: { revalidate: 60 }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setContent(normalizeContent(data.content, locale));
          }
        } else {
          // Use default content for current locale
          setContent(defaultContent[locale]);
        }
      } catch {
        // Use default content for current locale
        const locale: Locale = i18n.language?.startsWith('hi') ? 'hi' : 'en';
        setContent(defaultContent[locale]);
      }
    };
    
    fetchHeroContent();
  }, [i18n.language]);

  const currentLocale: Locale = i18n.language?.startsWith('hi') ? 'hi' : 'en';
  const slidesArr = Array.isArray(content?.slides) && content.slides.length > 0
    ? content.slides
    : defaultContent[currentLocale].slides;

  const heroSlides = heroSlideImages.map((image, index) => ({
    id: index + 1,
    image,
    title: slidesArr[index] ?? slidesArr[index % slidesArr.length] ?? defaultContent[currentLocale].slides[index]
  }));
  
  return (
    <section className="heroFullBleed" id="home" aria-label="Hero carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, A11y]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1200}
        style={{ width: '100%', height: '100%' }}
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="heroSlideFullBleed" 
              style={{backgroundImage: `url(${slide.image})`}}
              role="img"
              aria-label={slide.title}
            >
              <div className="heroContent">
                <h1 className="heroTitle">{slide.title}</h1>
                <p className="heroSubtitle">— {t('brand.name')}</p>
                <button className="ctaBtn heroBtn" aria-label={content.cta}>{content.cta}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
