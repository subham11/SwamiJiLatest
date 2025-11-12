'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { cards } from './cards.data';

export function CardCarousel(){
  return (
    <div className="carouselWrap">
      <Swiper
        modules={[Navigation, A11y, Keyboard, Mousewheel]}
        navigation
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        slidesPerView={6}
        spaceBetween={16}
        loop={false}
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 12 },
          480: { slidesPerView: 2.2, spaceBetween: 12 },
          768: { slidesPerView: 3.2, spaceBetween: 14 },
          1024: { slidesPerView: 4.2, spaceBetween: 16 },
          1280: { slidesPerView: 5.2, spaceBetween: 16 },
          1536: { slidesPerView: 6.2, spaceBetween: 18 },
        }}
        a11y={{
          prevSlideMessage: 'Previous card',
          nextSlideMessage: 'Next card',
        }}
      >
        {cards.map((c, index)=> (
          <SwiperSlide key={c.id}>
            <article className="cardItem" tabIndex={0} aria-labelledby={`carousel-card-${c.id}`}>
              <div className="cardThumb">
                <img
                  src={c.image}
                  alt={c.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  onError={(e)=>{
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.dataset.fallback !== '1') {
                      target.src = '/images/inspo/ins-1.svg';
                      target.dataset.fallback = '1';
                    }
                  }}
                />
              </div>
              <div className="cardOverlay">
                <h3 id={`carousel-card-${c.id}`}>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
