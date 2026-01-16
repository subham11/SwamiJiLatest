'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar } from '@/components/NavBar';
import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import styles from './page.module.css';

export default function NarayanBaliPage() {
  const { t, i18n } = useTranslation();

  const heroSections = useMemo(() => {
    const isHindi = i18n.language === 'hi';
    const baseDescriptions = isHindi
      ? [
          'पितृ दोष निवारण और आत्मा की शांति के लिए',
          'वैदिक विधि-विधान से पूर्ण अनुष्ठान',
          'मोक्ष प्राप्ति और पितृ ऋण मुक्ति',
        ]
      : [
          'For ancestral peace and removal of Pitru Dosha',
          'Complete ritual as per Vedic traditions',
          'Liberation and freedom from ancestral debts',
        ];

    return [
      {
        id: 1,
        title: isHindi ? 'नारायण बलि पूजन' : 'Narayan Bali Poojan',
        description: baseDescriptions[0],
        imageUrl: '/images/ashram/AshramHawan_01.jpeg',
      },
      {
        id: 2,
        title: isHindi ? 'पितृ दोष निवारण' : 'Pitru Dosha Nivaran',
        description: baseDescriptions[1],
        imageUrl: '/images/ashram/AshramHawan_02.jpeg',
      },
      {
        id: 3,
        title: isHindi ? 'आत्मा की मुक्ति' : 'Soul Liberation',
        description: baseDescriptions[2],
        imageUrl: '/images/ashram/AshramHawan_03.jpeg',
      },
    ];
  }, [i18n.language]);

  const infoCards = [
    {
      id: 'when',
      title: t('narayanBali.cards.when.title'),
      description: t('narayanBali.cards.when.desc'),
    },
    {
      id: 'who',
      title: t('narayanBali.cards.who.title'),
      description: t('narayanBali.cards.who.desc'),
    },
    {
      id: 'vidhi',
      title: t('narayanBali.cards.vidhi.title'),
      description: t('narayanBali.cards.vidhi.desc'),
    },
    {
      id: 'contact',
      title: t('narayanBali.cards.contact.title'),
      description: t('narayanBali.cards.contact.desc'),
    },
  ];

  const benefits = [
    t('narayanBali.benefits.item1'),
    t('narayanBali.benefits.item2'),
    t('narayanBali.benefits.item3'),
    t('narayanBali.benefits.item4'),
    t('narayanBali.benefits.item5'),
    t('narayanBali.benefits.item6'),
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
          <h1 className={styles.title}>{t('narayanBali.title')}</h1>
          <div className={styles.textContent}>
            <p className={styles.paragraph}>{t('narayanBali.paragraph1')}</p>
            <p className={styles.paragraph}>{t('narayanBali.paragraph2')}</p>
            <p className={styles.paragraph}>{t('narayanBali.paragraph3')}</p>
            <p className={styles.paragraph}>{t('narayanBali.paragraph4')}</p>
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContainer}>
          <h2 className={styles.benefitsTitle}>{t('narayanBali.benefitsTitle')}</h2>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.benefitIcon}>✦</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoHeader}>
          <h2>{i18n.language === 'hi' ? 'अनुष्ठान मार्गदर्शिका' : 'Ritual Guidelines'}</h2>
          <p>{i18n.language === 'hi' ? 'नारायण बलि पूजन से पूर्व आवश्यक जानकारी' : 'Essential information before Narayan Bali Poojan'}</p>
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

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>{i18n.language === 'hi' ? 'नारायण बलि पूजन के लिए संपर्क करें' : 'Contact for Narayan Bali Poojan'}</h2>
          <p>{i18n.language === 'hi' 
            ? 'स्वामी रुपेश्वरानंद आश्रम में वैदिक विधि-विधान से नारायण बलि पूजन का आयोजन किया जाता है।' 
            : 'Narayan Bali Poojan is conducted at Swami Rupeshwaranand Ashram following authentic Vedic procedures.'}</p>
          <button className={styles.ctaButton}>
            {i18n.language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
          </button>
        </div>
      </section>
    </main>
  );
}
