'use client';

import { useMemo, useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface PageContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  paragraph5: string;
}

// Default slides for fallback
const defaultSlidesEn: HeroSlide[] = [
  { id: 1, title: 'Shri Bajrang Baan Campaign', description: 'Achieve success and strength in life with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/b2l.png' },
  { id: 2, title: 'Spiritual Power', description: 'Recitation of Bajrang Baan provides extraordinary strength and protection', imageUrl: '/images/Bajrang_Baan/c2l.png' },
  { id: 3, title: 'Daily Sadhana', description: 'Regular recitation brings positive energy to life', imageUrl: '/images/Bajrang_Baan/d2l.png' },
  { id: 4, title: 'Sankat Mochan', description: 'All obstacles are removed with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/e2l.png' },
  { id: 5, title: 'Divine Blessings', description: 'Receive divine blessings through devotion and faith', imageUrl: '/images/Bajrang_Baan/f2l.png' }
];

const defaultSlidesHi: HeroSlide[] = [
  { id: 1, title: 'श्री बजरंग बाण अभियान', description: 'श्री हनुमान जी की कृपा से जीवन में सफलता और शक्ति प्राप्त करें', imageUrl: '/images/Bajrang_Baan/b2l.png' },
  { id: 2, title: 'आध्यात्मिक शक्ति', description: 'बजरंग बाण के पाठ से मिलती है अद्भुत शक्ति और सुरक्षा', imageUrl: '/images/Bajrang_Baan/c2l.png' },
  { id: 3, title: 'दैनिक साधना', description: 'नियमित पाठ से जीवन में आती है सकारात्मक ऊर्जा', imageUrl: '/images/Bajrang_Baan/d2l.png' },
  { id: 4, title: 'संकट मोचन', description: 'हनुमान जी की कृपा से दूर होते हैं सभी संकट', imageUrl: '/images/Bajrang_Baan/e2l.png' },
  { id: 5, title: 'आशीर्वाद', description: 'भक्ति और श्रद्धा से प्राप्त करें दिव्य आशीर्वाद', imageUrl: '/images/Bajrang_Baan/f2l.png' }
];

// Default content for fallback
const defaultContentEn: PageContent = {
  title: '|| Shri Bajrang Baan Divine Weapon Practice - Under the Guidance of Param Pujya Shri Rupeshwaranand Ji ||',
  paragraph1: 'Those devotees who wish to resolve their divine problems with the grace of Lord Hanuman, who want purification of their homes, who feel afflicted by obstacles such as evil spirits, should recite Shri Baan at least 11 times daily!',
  paragraph2: 'A collective campaign has been initiated under the leadership of Swami Rupeshwaranand Ji Maharaj in the form of "Shri Bajrang Baan Divine Weapon Practice" to recite 108 times every Sunday at 5 AM, whose main objective is national welfare, upliftment of Sanatan culture, and public welfare!',
  paragraph3: 'By participating in this campaign and reciting Shri Bajrang Baan, many devotees have received divine benefits and their divine problems have been resolved! Spiritual progress has also been experienced! The main goal through this collective campaign is to purify the divine atmosphere of India.',
  paragraph4: 'Special practitioners should master Shri Ram Raksha Stotra! This will provide them complete divine protection!',
  paragraph5: 'Before the 108 recitations of Bajrang Baan, must perform Shatkarma and Sankalpa...must read the protective shield!'
};

const defaultContentHi: PageContent = {
  title: '|| श्री बजरंग बाण दिव्यास्त्र प्रयोग - परम पूज्य श्री रुपेश्वरानंद जी के मार्गदर्शन में ||',
  paragraph1: 'जो श्रध्दालु, हनुमान जी के भक्त गण श्री हनुमान जी कृपा से अपनी दैवीय समस्याओं का समाधान चाहते है, घर का शुध्दिकरण चाहते है, जो प्रेत आदि बाधाओं से स्वयं को ग्रसित समझते है, वे नित्य श्री बाण का कम से कम 11 पाठ करें!',
  paragraph2: '"श्री बजरंग बाण दिव्यास्त्र प्रयोग" के रूप में प्रत्येक रविवार को प्रातः 5 बजे 108 पाठ करने का एक सामूहिक अभियान स्वामी रुपेश्वरानंद जी महाराज के नेतृत्त्व में आरम्भ किया गया है, जिसका मुख्य उद्देश्य राष्ट्र कल्याण, सनातन संस्कृति का उत्थान एवं जन कल्याण है!',
  paragraph3: 'इस अभियान में भाग लेते हुए श्री बजरंग बाण का पाठ करने से अनेक श्रध्दालुओं को दैवीय लाभ हुए है तथा उनकी दैवीय समस्याओं का समाधान हुआ है! साथ ही आध्यात्मिक उन्नति के अनुभव भी हुए है! इस सामूहिक अभियान के माध्यम से भारतवर्ष के दैवीय वातावरण में शुध्दिकरण करना मुख्य लक्ष्य है।',
  paragraph4: 'विशेष साधक श्री राम रक्षा स्तोत्र सिद्ध कर लें! इससे उन्हें पूर्ण दैवीय सुरक्षा प्राप्त होगी!',
  paragraph5: 'बजरंग बाण 108 पाठ के पूर्व षट्कर्म और संकल्प अवश्य करें...रक्षा कवच अवश्य पढ़ लें!'
};

export default function BajrangBaanPage() {
  const { ready, i18n } = useTranslation();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch hero and content from API
  useEffect(() => {
    const fetchContent = async () => {
      const locale = i18n.language === 'hi' ? 'hi' : 'en';
      const defaultSlides = locale === 'hi' ? defaultSlidesHi : defaultSlidesEn;
      const defaultContent = locale === 'hi' ? defaultContentHi : defaultContentEn;
      
      try {
        // Fetch both hero and content in parallel
        const [heroResponse, contentResponse] = await Promise.all([
          fetch(`/api/page-content/${locale}/bajrang-baan/bajrang-hero`),
          fetch(`/api/page-content/${locale}/bajrang-baan/bajrang-content`)
        ]);

        // Handle hero slides
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData?.content?.slides && Array.isArray(heroData.content.slides)) {
            setHeroSlides(heroData.content.slides);
          } else {
            setHeroSlides(defaultSlides);
          }
        } else {
          setHeroSlides(defaultSlides);
        }

        // Handle page content
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          if (contentData?.content) {
            setPageContent({
              title: contentData.content.title || defaultContent.title,
              paragraph1: contentData.content.paragraph1 || defaultContent.paragraph1,
              paragraph2: contentData.content.paragraph2 || defaultContent.paragraph2,
              paragraph3: contentData.content.paragraph3 || defaultContent.paragraph3,
              paragraph4: contentData.content.paragraph4 || defaultContent.paragraph4,
              paragraph5: contentData.content.paragraph5 || defaultContent.paragraph5,
            });
          } else {
            setPageContent(defaultContent);
          }
        } else {
          setPageContent(defaultContent);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setHeroSlides(defaultSlides);
        setPageContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      setLoading(true);
      fetchContent();
    }
  }, [i18n.language, ready]);

  // Convert slides to sections format for ScrollSnapAnimation
  const heroSections = useMemo(() => {
    if (heroSlides.length === 0) {
      const defaultSlides = i18n.language === 'hi' ? defaultSlidesHi : defaultSlidesEn;
      return defaultSlides;
    }
    return heroSlides;
  }, [heroSlides, i18n.language]);

  // Get content with fallback
  const content = useMemo(() => {
    if (pageContent) return pageContent;
    return i18n.language === 'hi' ? defaultContentHi : defaultContentEn;
  }, [pageContent, i18n.language]);

  if (!ready || loading) {
    return null;
  }

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
            {content.title}
          </h2>
          
          <div className={styles.textContent}>
            <p className={styles.paragraph}>
              {content.paragraph1}
            </p>
            
            <p className={styles.paragraph}>
              {content.paragraph2}
            </p>
            
            <p className={styles.paragraph}>
              {content.paragraph3}
            </p>
            
            <p className={`${styles.paragraph} ${styles.highlightPrimary}`}>
              {content.paragraph4}
            </p>
            
            <p className={styles.highlightAccent}>
              {content.paragraph5}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
