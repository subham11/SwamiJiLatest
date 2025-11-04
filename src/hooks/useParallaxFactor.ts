import { useEffect, useState } from "react";

/** 
 * Returns a 0..1 factor representing scroll progress for simple parallax effects.
 * CLEAN/SOLID: isolates scroll computations to a reusable hook.
 */
export function useParallaxFactor(max = 400){
  const [factor, setFactor] = useState(0);
  useEffect(()=>{
    const onScroll = () => {
      const y = window.scrollY;
      setFactor(Math.min(1, Math.max(0, y / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [max]);
  return factor;
}
