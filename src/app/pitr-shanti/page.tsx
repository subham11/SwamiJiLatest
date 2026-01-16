'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { NavBar } from '@/components/NavBar';
import styles from './page.module.css';

export default function PitrShantiPage() {
  const { t, i18n } = useTranslation();

  const heroSections = useMemo(() => {
    const isHindi = i18n.language === 'hi';
    const baseDescriptions = isHindi
      ? [
          'सभी पूर्वजों की आत्माओं को शांति',
          'वैदिक विधि-विधान से पूर्ण अनुष्ठान',
          'पितृ दोष निवारण और मुक्ति',
        ]
      : [
          'Peace for all ancestral souls',
          'Complete ritual as per Vedic traditions',
          'Removal of Pitri Dosha and liberation',
        ];

    return [
      {
        id: 1,
        title: isHindi ? 'पितृ शांति पूजन' : 'Pitr Shanti Poojan',
        description: baseDescriptions[0],
        imageUrl: '/images/pitr-shanti/PitrShanti_01.jpeg',
      },
      {
        id: 2,
        title: isHindi ? 'पितृ दोष निवारण' : 'Pitri Dosha Removal',
        description: baseDescriptions[1],
        imageUrl: '/images/pitr-shanti/PitrShanti_02.jpeg',
      },
      {
        id: 3,
        title: isHindi ? 'पूर्वजों की मुक्ति' : 'Ancestral Liberation',
        description: baseDescriptions[2],
        imageUrl: '/images/pitr-shanti/PitrShanti_03.jpeg',
      },
    ];
  }, [i18n.language]);

  const infoCards = [
    {
      id: 'meaning',
      title: t('pitrShanti.cards.meaning.title'),
      desc: t('pitrShanti.cards.meaning.desc'),
    },
    {
      id: 'when',
      title: t('pitrShanti.cards.when.title'),
      desc: t('pitrShanti.cards.when.desc'),
    },
    {
      id: 'who',
      title: t('pitrShanti.cards.who.title'),
      desc: t('pitrShanti.cards.who.desc'),
    },
    {
      id: 'vidhi',
      title: t('pitrShanti.cards.vidhi.title'),
      desc: t('pitrShanti.cards.vidhi.desc'),
    },
  ];

  return (
    <>
      <NavBar />
      <main className={styles.container}>
        {/* Hero Section with Swiper */}
        <section className={styles.heroSection} aria-label="Pitr Shanti Hero">
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
            }}
          >
            {heroSections.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className={styles.heroSlide}
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  role="img"
                  aria-label={slide.title}
                >
                  <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}>{slide.title}</h1>
                    <p className={styles.heroDescription}>{slide.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Introduction Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>{t('pitrShanti.introTitle')}</h2>
            <p className={styles.paragraph}>{t('pitrShanti.paragraph1')}</p>
            <p className={styles.paragraph}>{t('pitrShanti.paragraph2')}</p>
          </div>
        </section>

        {/* Why Section */}
        <section className={`${styles.section} ${styles.altSection}`}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>{t('pitrShanti.whyTitle')}</h2>
            <p className={styles.paragraph}>{t('pitrShanti.paragraph3')}</p>
            <p className={styles.paragraph}>{t('pitrShanti.paragraph4')}</p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>{t('pitrShanti.benefitsTitle')}</h2>
            <div className={styles.benefitsGrid}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <span className={styles.iconCircle}>{num}</span>
                  </div>
                  <p className={styles.benefitText}>{t(`pitrShanti.benefits.item${num}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className={`${styles.section} ${styles.altSection}`}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>{t('pitrShanti.stepsTitle')}</h2>
            <div className={styles.stepsContainer}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{num}</div>
                  <h3 className={styles.stepTitle}>{t(`pitrShanti.steps.step${num}.title`)}</h3>
                  <p className={styles.stepDesc}>{t(`pitrShanti.steps.step${num}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Cards Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <div className={styles.infoCards}>
              {infoCards.map((card) => (
                <div key={card.id} className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.sectionContent}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{t('pitrShanti.ctaTitle')}</h2>
              <p className={styles.ctaText}>{t('pitrShanti.ctaDesc')}</p>
              <button className={styles.ctaButton}>{t('pitrShanti.ctaButton')}</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
