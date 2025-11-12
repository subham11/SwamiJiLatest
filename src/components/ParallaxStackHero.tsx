"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";

export type Slide = {
  id: string;
  title?: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
  href?: string;
  image: { src: string; alt: string; width?: number; height?: number };
  overlayGradient?: boolean;
};

export type ParallaxStackHeroProps = {
  slides: Slide[];
  height?: number;        // vh; default 85
  visiblePeek?: number;   // px peek at TOP; default 28
  radius?: string;        // Tailwind radius class
  shadow?: boolean;       // default true
  snap?: boolean;         // enable page-like snapping
  controls?: boolean;     // arrows + dots
  drag?: boolean;         // allow vertical drag to advance; default true
};

function usePrefersReducedMotion() {
  const [reduced, set] = React.useState(false);
  React.useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    set(q.matches);
    const onChange = (e: MediaQueryListEvent) => set(e.matches);
    q.addEventListener?.("change", onChange);
    return () => q.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// clamp01 helper
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function ParallaxStackHero({
  slides,
  height = 85,
  visiblePeek = 28,
  radius = "rounded-2xl",
  shadow = true,
  snap = true,
  controls = true,
  drag = true,
}: ParallaxStackHeroProps) {
  const total = Math.max(1, slides.length);
  const sectionVH = total * 100 + 10;

  const reduced = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.2 });

  // ----- Step mode: each card owns a segment of progress -----
  const segmentIndex = useMotionValue(0);
  const segmentT = useMotionValue(0);

  React.useEffect(() => {
    const unsub = progress.on("change", (p: number) => {
      const x = p * total;
      const idx = Math.floor(x);
      segmentIndex.set(clamp01(idx));
      segmentT.set(clamp01(x - idx));
    });
    return () => unsub?.();
  }, [progress, total, segmentIndex, segmentT]);

  // Programmatic scroll
  const scrollToIndex = React.useCallback((index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pageTop = window.scrollY + rect.top;
    const target = pageTop + index * window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  // Drag-to-advance (vertical)
  const dragY = useMotionValue(0);
  const onDragEnd = (_: any, info: { offset: { y: number } }) => {
    const dy = info?.offset?.y ?? 0;
    const current = Math.round(progress.get() * (total - 1));
    if (dy < -40) scrollToIndex(Math.min(current + 1, total - 1));
    else if (dy > 40) scrollToIndex(Math.max(current - 1, 0));
  };

  const radiusClass = radius;
  const cardShadow = shadow ? "psh-shadow" : "";

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `min(${sectionVH}vh, ${total * 110}svh)` }}
      aria-label="Parallax hero stack section"
    >
      <div
        className="sticky left-0 top-0 mx-auto flex w-full max-w-6xl items-start px-4 sm:px-6 lg:px-8"
        style={{ height: `${height}vh` }}
      >
        <motion.div
          className="relative w-full h-full"
          drag={drag && !reduced ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.12}
          style={{ y: dragY }}
          onDragEnd={onDragEnd}
        >
          {slides.map((slide, i) => {
            // Track active state for this slide
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isCurrentActive, setCurrentActive] = React.useState(false);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              const unsub = segmentIndex.on("change", (idx) => setCurrentActive(Math.floor(idx) === i));
              setCurrentActive(Math.floor(segmentIndex.get()) === i);
              return () => unsub?.();
            }, [i]);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const yPercent = useTransform(segmentT, [0, 1], [0, 110]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const yPercentString = useTransform(yPercent, (v) => `${v}%`);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const parallax = useTransform(progress, [0, 1], [0, 8]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const blurFilter = useTransform(segmentT, (t) => `blur(${t * 6}px)`);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacityValue = useTransform(segmentT, (t) => 1 - t * 0.15);

            return (
              <motion.article
                key={slide.id}
                aria-roledescription="slide"
                className={`absolute inset-0 overflow-hidden bg-neutral-900 ${radiusClass} ${cardShadow}`}
                style={{
                  zIndex: total - i,
                  top: i === 0 ? 0 : undefined,
                  marginTop: i === 0 ? 0 : visiblePeek * i,
                  transformOrigin: "center",
                  y: reduced ? 0 : (isCurrentActive ? yPercentString : parallax),
                  scale: reduced ? 1 : (isCurrentActive ? 0.92 : 1),
                }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
                    className="object-cover"
                  />
                  {slide.overlayGradient !== false && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent"
                      style={{ 
                        filter: reduced ? "none" : (isCurrentActive ? blurFilter : "blur(0px)"),
                        opacity: reduced ? 1 : (isCurrentActive ? opacityValue : 1)
                      }}
                    />
                  )}
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 text-white">
                  <div>
                    {slide.badge && (
                      <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                        {slide.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    {slide.title && (
                      <h2 className="mb-2 text-2xl sm:text-4xl font-semibold leading-tight drop-shadow">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-sm sm:text-base text-white/90 max-w-xl">
                        {slide.description}
                      </p>
                    )}
                    {slide.ctaLabel && (
                      <a
                        href={slide.href || '#'}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
                        aria-label={`Open ${slide.ctaLabel}`}
                      >
                        {slide.ctaLabel}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {controls && (
        <div
          className="pointer-events-none sticky left-0 top-0 z-50 mx-auto flex w-full max-w-6xl items-start justify-between px-4 sm:px-6 lg:px-8"
          style={{ height: `${height}vh` }}
        >
          <div className="pointer-events-auto self-start pt-6">
            <NavDots total={total} progress={progress} onJump={scrollToIndex} />
          </div>
          <div className="pointer-events-auto self-center ml-auto flex gap-3">
            <button
              className="rounded-full bg-black/50 p-3 text-white backdrop-blur hover:bg-black/60"
              aria-label="Previous"
              onClick={() => {
                const current = Math.round(progress.get() * (total - 1));
                scrollToIndex(Math.max(current - 1, 0));
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="rounded-full bg-black/50 p-3 text-white backdrop-blur hover:bg-black/60"
              aria-label="Next"
              onClick={() => {
                const current = Math.round(progress.get() * (total - 1));
                scrollToIndex(Math.min(current + 1, total - 1));
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {snap && (
        <style>{`
          @supports (scroll-snap-type: y mandatory) {
            html:has(section[aria-label="Parallax hero stack section"]) body {
              scroll-snap-type: y proximity;
            }
          }
        `}</style>
      )}
    </section>
  );
}

function NavDots({
  total, progress, onJump,
}: { total: number; progress: any; onJump: (i: number) => void }) {
  const activeIndex = Math.max(0, Math.min(total - 1, Math.round((progress.get?.() ?? 0) * (total - 1))));
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const unsub = progress.on("change", () => force());
    return () => unsub?.();
  }, [progress]);

  return (
    <div role="tablist" aria-label="Hero slides" className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === activeIndex}
          aria-current={i === activeIndex}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onJump(i)}
          className={["h-2.5 w-2.5 rounded-full transition-all", i === activeIndex ? "w-6 bg-white" : "bg-white/60 hover:bg-white"].join(" ")}
        />
      ))}
    </div>
  );
}
