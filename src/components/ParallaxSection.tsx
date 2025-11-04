'use client';

type Props = { title: string; subtitle: string; bgImage: string; };

export function ParallaxSection({ title, subtitle, bgImage }: Props){
  return (
    <section
      className="parallaxWrap"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="parallaxOverlay container">
        <span className="badge">PARALLAX</span>
        <h2 style={{fontSize:'clamp(1.75rem,2.5vw,3rem)'}}>{title}</h2>
        <p style={{maxWidth:700, opacity:.9}}>{subtitle}</p>
      </div>
    </section>
  );
}
