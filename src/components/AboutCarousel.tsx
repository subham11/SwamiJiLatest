"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type AboutItem = {
  id: number | string;
  title: string;
  description: string;
  image: string;
  subtitle?: string;
};

export function AboutCarousel({ items }: { items: AboutItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="container aboutCarousel" aria-label="About Swamiji">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        style={{ width: '100%' }}
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
      >
        {items.map((it, index) => (
          <SwiperSlide key={it.id}>
            <article className="aboutSlide">
              <div className="aboutSlideImageWrap">
                <img 
                  src={it.image} 
                  alt={it.title} 
                  className="aboutSlideImage" 
                  loading={index === 0 ? 'eager' : 'lazy'} 
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              </div>
              <div className="aboutSlideText">
                <h2 className="aboutSlideTitle">{it.title}</h2>
                {it.subtitle && <div className="aboutSlideSubtitle">{it.subtitle}</div>}
                {it.description && (
                  <div className="aboutSlideDescription">
                    {it.description.split('\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default AboutCarousel;
