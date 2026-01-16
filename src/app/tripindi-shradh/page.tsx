'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar } from '@/components/NavBar';
import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import styles from './page.module.css';

export default function TripindiShradhPage() {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const heroSections = useMemo(() => {
    const isHindi = i18n.language === 'hi';
    const baseDescriptions = isHindi
      ? [
          'तीन पीढ़ियों के पितरों की शांति के लिए',
          'पितृ ऋण मुक्ति और परिवार कल्याण',
          'वैदिक विधि-विधान से पूर्ण श्राद्ध अनुष्ठान',
        ]
      : [
          'For the peace of three generations of ancestors',
          'Liberation from ancestral debts and family welfare',
          'Complete Shradh ritual as per Vedic traditions',
        ];

    return [
      {
        id: 1,
        title: isHindi ? 'त्रिपिंडी श्राद्ध पूजन' : 'Tripindi Shradh Poojan',
        description: baseDescriptions[0],
        imageUrl: '/images/ashram/AshramHawan_01.jpeg',
      },
      {
        id: 2,
        title: isHindi ? 'पितृ तर्पण' : 'Ancestral Offerings',
        description: baseDescriptions[1],
        imageUrl: '/images/ashram/AshramHawan_02.jpeg',
      },
      {
        id: 3,
        title: isHindi ? 'मोक्ष मार्ग' : 'Path to Liberation',
        description: baseDescriptions[2],
        imageUrl: '/images/ashram/AshramHawan_03.jpeg',
      },
    ];
  }, [i18n.language]);

  const infoCards = [
    {
      id: 'meaning',
      icon: '🕉️',
      title: t('tripindiShradh.cards.meaning.title'),
      description: t('tripindiShradh.cards.meaning.desc'),
    },
    {
      id: 'when',
      icon: '📅',
      title: t('tripindiShradh.cards.when.title'),
      description: t('tripindiShradh.cards.when.desc'),
    },
    {
      id: 'who',
      icon: '👨‍👩‍👧‍👦',
      title: t('tripindiShradh.cards.who.title'),
      description: t('tripindiShradh.cards.who.desc'),
    },
    {
      id: 'vidhi',
      icon: '🔥',
      title: t('tripindiShradh.cards.vidhi.title'),
      description: t('tripindiShradh.cards.vidhi.desc'),
    },
  ];

  const benefits = [
    { icon: '✨', text: t('tripindiShradh.benefits.item1') },
    { icon: '🙏', text: t('tripindiShradh.benefits.item2') },
    { icon: '💫', text: t('tripindiShradh.benefits.item3') },
    { icon: '🏠', text: t('tripindiShradh.benefits.item4') },
    { icon: '❤️', text: t('tripindiShradh.benefits.item5') },
    { icon: '🌟', text: t('tripindiShradh.benefits.item6') },
  ];

  const ritualSteps = [
    { step: 1, title: t('tripindiShradh.steps.step1.title'), desc: t('tripindiShradh.steps.step1.desc') },
    { step: 2, title: t('tripindiShradh.steps.step2.title'), desc: t('tripindiShradh.steps.step2.desc') },
    { step: 3, title: t('tripindiShradh.steps.step3.title'), desc: t('tripindiShradh.steps.step3.desc') },
    { step: 4, title: t('tripindiShradh.steps.step4.title'), desc: t('tripindiShradh.steps.step4.desc') },
    { step: 5, title: t('tripindiShradh.steps.step5.title'), desc: t('tripindiShradh.steps.step5.desc') },
  ];

  return (
    <main className={styles.main}>
      <NavBar />
      <ScrollSnapAnimation
        defaultEffect="fade"
        hideHeader={true}
        customSections={heroSections}
        reducedHeight={true}
      />

      {/* Content Section */}
      <section 
        id="content"
        ref={(el) => { sectionRefs.current['content'] = el; }}
        className={`${styles.contentSection} ${isVisible['content'] ? styles.visible : ''}`}
      >
        <div className={styles.contentCard}>
          <div className={styles.titleWrapper}>
            <span className={styles.titleIcon}>🙏</span>
            <h1 className={styles.title}>{t('tripindiShradh.title')}</h1>
          </div>
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerIcon}>॥</span>
            <span className={styles.dividerLine}></span>
          </div>
          <div className={styles.textContent}>
            <p className={styles.paragraph}>{t('tripindiShradh.paragraph1')}</p>
            <p className={styles.paragraph}>{t('tripindiShradh.paragraph2')}</p>
            <p className={styles.paragraph}>{t('tripindiShradh.paragraph3')}</p>
            <p className={`${styles.paragraph} ${styles.highlight}`}>{t('tripindiShradh.paragraph4')}</p>
          </div>
        </div>
      </section>

      {/* Ritual Steps Section */}
      <section 
        id="steps"
        ref={(el) => { sectionRefs.current['steps'] = el; }}
        className={`${styles.stepsSection} ${isVisible['steps'] ? styles.visible : ''}`}
      >
        <div className={styles.stepsContainer}>
          <h2 className={styles.stepsTitle}>
            {i18n.language === 'hi' ? 'अनुष्ठान क्रम' : 'Ritual Procedure'}
          </h2>
          <div className={styles.stepsTimeline}>
            {ritualSteps.map((item, index) => (
              <div 
                key={item.step} 
                className={styles.stepItem}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={styles.stepNumber}>{item.step}</div>
                <div className={styles.stepContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits"
        ref={(el) => { sectionRefs.current['benefits'] = el; }}
        className={`${styles.benefitsSection} ${isVisible['benefits'] ? styles.visible : ''}`}
      >
        <div className={styles.benefitsContainer}>
          <h2 className={styles.benefitsTitle}>{t('tripindiShradh.benefitsTitle')}</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={styles.benefitCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className={styles.benefitIcon}>{benefit.icon}</span>
                <p className={styles.benefitText}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section 
        id="info"
        ref={(el) => { sectionRefs.current['info'] = el; }}
        className={`${styles.infoSection} ${isVisible['info'] ? styles.visible : ''}`}
      >
        <div className={styles.infoHeader}>
          <h2>{i18n.language === 'hi' ? 'महत्वपूर्ण जानकारी' : 'Important Information'}</h2>
          <p>{i18n.language === 'hi' ? 'त्रिपिंडी श्राद्ध से संबंधित आवश्यक निर्देश' : 'Essential guidelines for Tripindi Shradh'}</p>
        </div>
        <div className={styles.infoGrid}>
          {infoCards.map((card, index) => (
            <div 
              key={card.id} 
              className={styles.infoCard}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta"
        ref={(el) => { sectionRefs.current['cta'] = el; }}
        className={`${styles.ctaSection} ${isVisible['cta'] ? styles.visible : ''}`}
      >
        <div className={styles.ctaContent}>
          <div className={styles.ctaGlow}></div>
          <h2>{i18n.language === 'hi' ? 'त्रिपिंडी श्राद्ध पूजन हेतु संपर्क करें' : 'Contact for Tripindi Shradh Poojan'}</h2>
          <p>{i18n.language === 'hi' 
            ? 'स्वामी रुपेश्वरानंद आश्रम में अनुभवी पुरोहितों द्वारा शास्त्रोक्त विधि से त्रिपिंडी श्राद्ध संपन्न कराएं।' 
            : 'Get Tripindi Shradh performed by experienced priests at Swami Rupeshwaranand Ashram following scriptural procedures.'}</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaButtonPrimary}>
              {i18n.language === 'hi' ? 'अभी बुक करें' : 'Book Now'}
            </button>
            <button className={styles.ctaButtonSecondary}>
              {i18n.language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
