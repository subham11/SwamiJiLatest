'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';

const heroSlides = [
  { id: 1, image: '/images/hero/hero-1.svg', titleKey: 'hero.slide1' },
  { id: 2, image: '/images/hero/hero-2.svg', titleKey: 'hero.slide2' },
  { id: 3, image: '/images/hero/hero-3.svg', titleKey: 'hero.slide1' },
  { id: 4, image: '/images/hero/hero-4.svg', titleKey: 'hero.slide2' },
  { id: 5, image: '/images/hero/hero-5.svg', titleKey: 'hero.slide1' },
  { id: 6, image: '/images/hero/hero-6.svg', titleKey: 'hero.slide2' },
  { id: 7, image: '/images/hero/hero-7.svg', titleKey: 'hero.slide1' },
];

export function Hero(){
  const { t } = useTranslation();
  
  return (
    <div className="heroFullBleed" id="home">
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
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="heroSlideFullBleed" style={{backgroundImage: `url(${slide.image})`}}>
              <div className="heroContent">
                <h1 className="heroTitle">{t(slide.titleKey)}</h1>
                <p className="heroSubtitle">— {t('brand.name')}</p>
                <button className="ctaBtn heroBtn">{t('hero.cta')}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
