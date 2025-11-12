'use client';

import { NavBar } from '@/components/NavBar';
import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

export default function BajrangBaanPage() {
  const { t } = useTranslation();
  const heroSections = [
    {
      id: 1,
      title: 'श्री बजरंग बाण अभियान',
      description: 'श्री हनुमान जी की कृपा से जीवन में सफलता और शक्ति प्राप्त करें',
      imageUrl: '/images/hanuman/hanu_01.jpg',
    },
    {
      id: 2,
      title: 'आध्यात्मिक शक्ति',
      description: 'बजरंग बाण के पाठ से मिलती है अद्भुत शक्ति और सुरक्षा',
      imageUrl: '/images/hanuman/hanu_02.jpg',
    },
    {
      id: 3,
      title: 'दैनिक साधना',
      description: 'नियमित पाठ से जीवन में आती है सकारात्मक ऊर्जा',
      imageUrl: '/images/hanuman/hanu_03.jpg',
    },
    {
      id: 4,
      title: 'संकट मोचन',
      description: 'हनुमान जी की कृपा से दूर होते हैं सभी संकट',
      imageUrl: '/images/hanuman/hanu_04.jpg',
    },
    {
      id: 5,
      title: 'आशीर्वाद',
      description: 'भक्ति और श्रद्धा से प्राप्त करें दिव्य आशीर्वाद',
      imageUrl: '/images/hanuman/hanu_05.jpg',
    },
  ];

  return (
    <main>
      <NavBar />
      <ScrollSnapAnimation 
        defaultEffect="zoom" 
        hideHeader={true} 
        customSections={heroSections}
        reducedHeight={true}
      />
      
      <section className={styles.contentSection}>
        <div className={styles.contentCard}>
          <h2 className={styles.title}>
            {t('bajrangBaan.title')}
          </h2>
          
          <div className={styles.textContent}>
            <p className={styles.paragraph}>
              {t('bajrangBaan.paragraph1')}
            </p>
            
            <p className={styles.paragraph}>
              {t('bajrangBaan.paragraph2')}
            </p>
            
            <p className={styles.paragraph}>
              {t('bajrangBaan.paragraph3')}
            </p>
            
            <p className={`${styles.paragraph} ${styles.highlightPrimary}`}>
              {t('bajrangBaan.paragraph4')}
            </p>
            
            <p className={styles.highlightAccent}>
              {t('bajrangBaan.paragraph5')}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
