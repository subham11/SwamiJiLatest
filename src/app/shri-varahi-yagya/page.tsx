'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar } from '@/components/NavBar';
import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import styles from './page.module.css';

export default function VarahiYagyaPage() {
  const { t, i18n } = useTranslation();

  const heroSections = useMemo(() => {
    const isHindi = i18n.language === 'hi';
    const baseDescriptions = isHindi
      ? [
          'देवी वाराही की कृपा से रक्षा और समृद्धि',
          'अनुष्ठान, अनुशासन और आंतरिक स्थिरता',
          'साधना, मंत्र-जप और आहुति का संगम',
        ]
      : [
          'Protection and prosperity through Mother Varahi',
          'Ritual discipline anchored in devotion',
          'Sadhana with mantra japa and focused offerings',
        ];

    return [
      {
        id: 1,
        title: isHindi ? 'श्री वाराही यज्ञ' : 'Shri Varahi Yagya',
        description: baseDescriptions[0],
        imageUrl: '/images/ashram/AshramHawan_01.jpeg',
      },
      {
        id: 2,
        title: isHindi ? 'आवाहन और संकल्प' : 'Invocation and Sankalpa',
        description: baseDescriptions[1],
        imageUrl: '/images/ashram/AshramHawan_02.jpeg',
      },
      {
        id: 3,
        title: isHindi ? 'साधना और आहुति' : 'Sadhana and Offerings',
        description: baseDescriptions[2],
        imageUrl: '/images/ashram/AshramHawan_03.jpeg',
      },
    ];
  }, [i18n.language]);

  const infoCards = [
    {
      id: 'schedule',
      title: t('varahiYagya.cards.schedule.title'),
      description: t('varahiYagya.cards.schedule.desc'),
    },
    {
      id: 'participation',
      title: t('varahiYagya.cards.participation.title'),
      description: t('varahiYagya.cards.participation.desc'),
    },
    {
      id: 'location',
      title: t('varahiYagya.cards.location.title'),
      description: t('varahiYagya.cards.location.desc'),
    },
    {
      id: 'contact',
      title: t('varahiYagya.cards.contact.title'),
      description: t('varahiYagya.cards.contact.desc'),
    },
  ];

  return (
    <main>
      <NavBar />
      <ScrollSnapAnimation
        defaultEffect="fade"
        hideHeader={true}
        customSections={heroSections}
        reducedHeight={true}
      />

      <section className={styles.contentSection}>
        <div className={styles.contentCard}>
          <h1 className={styles.title}>{t('varahiYagya.title')}</h1>
          <div className={styles.textContent}>
            <p className={styles.paragraph}>{t('varahiYagya.paragraph1')}</p>
            <p className={styles.paragraph}>{t('varahiYagya.paragraph2')}</p>
            <p className={styles.paragraph}>{t('varahiYagya.paragraph3')}</p>
            <p className={styles.paragraph}>{t('varahiYagya.paragraph4')}</p>
            <p className={`${styles.paragraph} ${styles.highlightPrimary}`}>
              {t('varahiYagya.paragraph5')}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoHeader}>
          <h2>{i18n.language === 'hi' ? 'भागीदारी मार्गदर्शिका' : 'Participation Guide'}</h2>
          <p>{i18n.language === 'hi' ? 'अनुष्ठान में सम्मिलित होने से पूर्व आवश्यक निर्देश पढ़ें।' : 'Read these quick notes before you join the ritual.'}</p>
        </div>
        <div className={styles.infoGrid}>
          {infoCards.map((card) => (
            <div key={card.id} className={styles.infoCard}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
