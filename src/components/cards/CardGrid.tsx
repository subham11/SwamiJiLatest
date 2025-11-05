'use client';

import { useEffect, useRef } from 'react';
import { cards } from './cards.data';

// Simple intersection observer based animation component using CSS classes
function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.classList.add('animate-in');
            }
          }, delay);
        }
      },
      { threshold: 0.4 }
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="card-animate"
    >
      {children}
    </div>
  );
}

export function CardGrid(){
  return (
    <div className="cardsGrid">
      {cards.map((c, i) => (
        <AnimatedCard key={c.id} delay={i * 100}>
          <article className="card" tabIndex={0} aria-label={c.title}>
            <img src={c.image} alt="" loading="lazy" decoding="async" style={{width:'100%', height:180, objectFit:'cover', borderRadius:12}}/>
            <h3 style={{margin:'.75rem 0 0 0'}}>{c.title}</h3>
            <p style={{color:'#555'}}>{c.desc}</p>
          </article>
        </AnimatedCard>
      ))}
    </div>
  );
}
