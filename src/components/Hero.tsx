'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';

const heroSlides = [
  { id: 1, image: '/images/TempleImages/Temple_01.jpeg', titleKey: 'hero.slide1' },
  { id: 2, image: '/images/TempleImages/Temple_02.jpeg', titleKey: 'hero.slide2' },
  { id: 3, image: '/images/TempleImages/Temple_03.jpeg', titleKey: 'hero.slide1' },
  { id: 4, image: '/images/TempleImages/Temple_04.jpeg', titleKey: 'hero.slide2' },
  { id: 5, image: '/images/TempleImages/Temple_05.jpeg', titleKey: 'hero.slide1' },
];

export function Hero(){
  const { t } = useTranslation();
  
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
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="heroSlideFullBleed" 
              style={{backgroundImage: `url(${slide.image})`}}
              role="img"
              aria-label={t(slide.titleKey)}
            >
              <div className="heroContent">
                <h1 className="heroTitle">{t(slide.titleKey)}</h1>
                <p className="heroSubtitle">— {t('brand.name')}</p>
                <button className="ctaBtn heroBtn" aria-label={t('hero.cta')}>{t('hero.cta')}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
