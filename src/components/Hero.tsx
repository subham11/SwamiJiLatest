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

interface HeroSlide {
  text: string;
  imageUrl: string;
}

interface HeroContent {
  slides: HeroSlide[];
  cta: string;
}

// Default images from TempleImages folder
const DEFAULT_IMAGES = [
  '/images/TempleImages/Temple_01.jpeg',
  '/images/TempleImages/Temple_02.jpeg',
  '/images/TempleImages/Temple_03.jpeg',
  '/images/TempleImages/Temple_04.jpeg',
  '/images/TempleImages/Temple_05.jpeg',
];

// Default slide texts
const defaultSlideTexts: Record<Locale, string[]> = {
  en: [
    'Divine Guidance For Modern Life',
    'Daily Inspirations & Teachings',
    'Path to Inner Peace',
    'Ancient Wisdom for Today',
    'Spiritual Awakening Awaits'
  ],
  hi: [
    'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
    'दैनिक प्रेरणाएँ और उपदेश',
    'आंतरिक शांति का मार्ग',
    'आज के लिए प्राचीन ज्ञान',
    'आध्यात्मिक जागृति आपका इंतज़ार कर रही है'
  ]
};

// Default content (used as fallback)
const defaultContent: Record<Locale, HeroContent> = {
  en: {
    slides: DEFAULT_IMAGES.map((img, i) => ({ text: defaultSlideTexts.en[i], imageUrl: img })),
    cta: 'Explore Now'
  },
  hi: {
    slides: DEFAULT_IMAGES.map((img, i) => ({ text: defaultSlideTexts.hi[i], imageUrl: img })),
    cta: 'अभी देखें'
  }
};

function normalizeSlides(raw: unknown, locale: Locale): HeroSlide[] {
  const fallback = defaultContent[locale].slides;
  
  // Handle array of slide objects with text and imageUrl
  if (Array.isArray(raw) && raw.length > 0) {
    const count = 5;
    const slides: HeroSlide[] = [];
    
    for (let i = 0; i < count; i++) {
      const item = raw[i] || raw[i % raw.length] || fallback[i];
      
      // If item is an object with text and imageUrl
      if (typeof item === 'object' && item !== null) {
        slides.push({
          text: typeof item.text === 'string' ? item.text : (fallback[i]?.text || ''),
          imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : (DEFAULT_IMAGES[i] || DEFAULT_IMAGES[0])
        });
      } 
      // If item is just a string (backward compatibility)
      else if (typeof item === 'string') {
        slides.push({
          text: item,
          imageUrl: DEFAULT_IMAGES[i] || DEFAULT_IMAGES[0]
        });
      } 
      // Fallback
      else {
        slides.push(fallback[i]);
      }
    }
    
    return slides;
  }
  
  return fallback;
}

function normalizeContent(data: any, locale: Locale): HeroContent {
  const slidesSource = data?.slides ?? [];
  const slides = normalizeSlides(slidesSource, locale);
  const cta = typeof data?.cta === 'string' && data.cta.trim() ? data.cta : defaultContent[locale].cta;
  return { slides, cta };
}

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

  const heroSlides = slidesArr.map((slide, index) => ({
    id: index + 1,
    image: slide.imageUrl || DEFAULT_IMAGES[index] || DEFAULT_IMAGES[0],
    title: slide.text || defaultSlideTexts[currentLocale][index] || ''
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
