'use client';

import { useMemo, useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
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

  useEffect(() => {
    const fetchContent = async () => {
      const locale = i18n.language === 'hi' ? 'hi' : 'en';
      const defaultSlides = locale === 'hi' ? defaultSlidesHi : defaultSlidesEn;
      const defaultContent = locale === 'hi' ? defaultContentHi : defaultContentEn;

      try {
        const [heroResponse, contentResponse] = await Promise.all([
          fetch(`/api/page-content/${locale}/bajrang-baan/bajrang-hero`),
          fetch(`/api/page-content/${locale}/bajrang-baan/bajrang-content`)
        ]);

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
        const fallbackSlides = locale === 'hi' ? defaultSlidesHi : defaultSlidesEn;
        setHeroSlides(fallbackSlides);
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

  const heroImage = useMemo(() => {
    if (heroSlides.length > 0 && heroSlides[0]?.imageUrl) return heroSlides[0].imageUrl;
    const fallback = i18n.language === 'hi' ? defaultSlidesHi : defaultSlidesEn;
    return fallback[0].imageUrl;
  }, [heroSlides, i18n.language]);

  const content = useMemo(() => {
    if (pageContent) return pageContent;
    return i18n.language === 'hi' ? defaultContentHi : defaultContentEn;
  }, [pageContent, i18n.language]);

  const vidhiSteps = useMemo(() => ([
    i18n.language === 'hi' ? 'समय: प्रातः या संध्या' : 'Time: Morning or evening',
    i18n.language === 'hi' ? 'स्नान करें या हाथ-पैर धोएं' : 'Preparation: bathe or wash hands/feet',
    i18n.language === 'hi' ? 'दिशा: उत्तर या पूर्व की ओर बैठें' : 'Direction: face North or East',
    i18n.language === 'hi' ? 'भोग: भुना/भिगोया चना' : 'Offering: roasted/soaked gram (chana)',
    i18n.language === 'hi' ? 'दीपक: घी का दीपक जलाएं' : 'Light a ghee lamp before Hanuman Ji'
  ]), [i18n.language]);

  const benefits = useMemo(() => ([
    {
      title: i18n.language === 'hi' ? 'रक्षा कवच' : 'Protection Shield',
      description: i18n.language === 'hi'
        ? 'नकारात्मक ऊर्जाओं से रक्षा और मानसिक दृढ़ता'
        : 'Shield against negative energies with renewed courage'
    },
    {
      title: i18n.language === 'hi' ? 'बाधा निवारण' : 'Remove Obstacles',
      description: i18n.language === 'hi'
        ? 'ग्रह/वास्तु दोष व व्यक्तिगत अड़चनों का शमन'
        : 'Helps clear Graha/Vastu hurdles and personal roadblocks'
    },
    {
      title: i18n.language === 'hi' ? 'आंतरिक शांति' : 'Inner Peace',
      description: i18n.language === 'hi'
        ? 'मन की शांति, बल और आध्यात्मिक उन्नति'
        : 'Mental clarity, strength, and spiritual upliftment'
    }
  ]), [i18n.language]);

  const downloads = useMemo(() => ([
    {
      title: i18n.language === 'hi' ? 'शुद्ध बजरंग बाण' : 'Shuddha Bajrang Baan',
      tag: i18n.language === 'hi' ? 'मुख्य पाठ' : 'Main path',
      cta: i18n.language === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'
    },
    {
      title: i18n.language === 'hi' ? 'राम रक्षा स्तोत्र' : 'Ram Raksha Stotra',
      tag: i18n.language === 'hi' ? 'रक्षा' : 'Protection',
      cta: i18n.language === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'
    },
    {
      title: i18n.language === 'hi' ? 'संकल्प व विधि' : 'Sankalp & Vidhi',
      tag: i18n.language === 'hi' ? 'विधि' : 'Procedure',
      cta: i18n.language === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'
    }
  ]), [i18n.language]);

  const faqs = useMemo(() => ([
    {
      q: i18n.language === 'hi' ? 'संकल्प कितनी बार लें?' : 'How often should I take the Sankalp?',
      a: i18n.language === 'hi'
        ? 'एक बार प्रारंभ में संकल्प लें, प्रतिदिन नहीं।'
        : 'Take the vow once at the start, not every day.'
    },
    {
      q: i18n.language === 'hi' ? 'सही भोग क्या है?' : 'What is the correct Bhog?',
      a: i18n.language === 'hi'
        ? 'भुना/भिगोया चना हनुमान जी को अर्पित करें।'
        : 'Offer roasted or soaked gram (chana) before starting.'
    }
  ]), [i18n.language]);

  if (!ready || loading) return null;

  return (
    <main className={styles.page}>
      <NavBar />

      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(120deg, rgba(255,77,0,0.82), rgba(255,116,0,0.65)), url(${heroImage})` }}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>{i18n.language === 'hi' ? 'स्वामी रुपेश्वरानंद जी के मार्गदर्शन में' : 'Under guidance of Swami Rupeshwaranand Ji'}</span>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroSubtitle}>{content.paragraph1}</p>
          <div className={styles.heroChips}>
            <span className={styles.chip}>{i18n.language === 'hi' ? 'रविवार • प्रातः 5:00 • 108 पाठ' : 'Sunday • 5:00 AM • 108 path'}</span>
            <span className={styles.chipAlt}>{i18n.language === 'hi' ? 'दैनिक • 11 पाठ' : 'Daily • 11 path'}</span>
          </div>
        </div>
      </section>

      <section className={styles.breadcrumbs}>
        <div className={styles.crumbsInner}>
          <span>{i18n.language === 'hi' ? 'होम' : 'Home'}</span>
          <span>›</span>
          <span>{i18n.language === 'hi' ? 'आश्रम' : 'Ashram'}</span>
          <span>›</span>
          <strong>{i18n.language === 'hi' ? 'दिव्यास्त्र प्रयोग' : 'Divyastra Prayog'}</strong>
        </div>
      </section>

      <section className={styles.layoutGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.cardPrimary}>
            <h3>{i18n.language === 'hi' ? 'अभियान से जुड़ें' : 'Join the Abhiyan'}</h3>
            <p>{i18n.language === 'hi' ? 'प्रत्येक रविवार • 108 पाठ' : 'Every Sunday • 108 path'}</p>
            <button className={styles.primaryBtn}>{i18n.language === 'hi' ? 'रजिस्टर करें' : 'Register now'}</button>
          </div>

          <div className={styles.cardPlain}>
            <h4>{i18n.language === 'hi' ? 'विषय सूची' : 'Table of contents'}</h4>
            <ul className={styles.tocList}>
              <li><a href="#vidhi">{i18n.language === 'hi' ? 'विधि व संकल्प' : 'Vidhi & Sankalp'}</a></li>
              <li><a href="#benefits">{i18n.language === 'hi' ? 'लाभ' : 'Benefits'}</a></li>
              <li><a href="#downloads">{i18n.language === 'hi' ? 'डाउनलोड' : 'Downloads'}</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className={styles.contactCard}>
            <h4>Swami Rupeshwaranand Ashram</h4>
            <p>Varanasi, Uttar Pradesh</p>
            <div className={styles.whatsapp}>+91-7607 233 230</div>
          </div>
        </aside>

        <div className={styles.mainColumn}>
          <section id="vidhi" className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2>{i18n.language === 'hi' ? 'विधि और संकल्प' : 'Vidhi & Sankalp'}</h2>
              <p>{content.paragraph2}</p>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.stepList}>
                {vidhiSteps.map((step, idx) => (
                  <div key={step} className={styles.stepItem}>
                    <span className={styles.stepDot}>{idx + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className={styles.sankalpBox}>
                <h3>{i18n.language === 'hi' ? 'संकल्प मंत्र' : 'Sankalp mantra'}</h3>
                <p>{i18n.language === 'hi'
                  ? '"मैं (अपना पूरा नाम) नामक आराधक श्री हनुमान जी की प्रसन्नता हेतु 108 श्री बजरंग बाण पाठ करने का संकल्प कर रहा हूँ"'
                  : '“I (full name) take a vow to recite Shri Bajrang Baan 108 times for the grace of Hanuman Ji.”'}</p>
                <p className={styles.sankalpNote}>{i18n.language === 'hi' ? 'जल छोड़ें और पाठ आरंभ करें' : 'Release water and begin the path.'}</p>
              </div>
            </div>
          </section>

          <section id="benefits" className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2>{i18n.language === 'hi' ? 'दिव्य लाभ' : 'Divine benefits'}</h2>
              <p>{content.paragraph3}</p>
            </div>
            <div className={styles.gridThree}>
              {benefits.map((item) => (
                <div key={item.title} className={styles.benefitCard}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="downloads" className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2>{i18n.language === 'hi' ? 'स्टोत्र डाउनलोड' : 'Download stotras'}</h2>
              <p>{content.paragraph4}</p>
            </div>
            <div className={styles.gridThree}>
              {downloads.map((item) => (
                <div key={item.title} className={styles.downloadCard}>
                  <span className={styles.downloadTag}>{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{i18n.language === 'hi' ? 'प्रामाणिक पाठ और विधि' : 'Authentic text with guidance'}</p>
                  <button className={styles.outlineBtn}>{item.cta}</button>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2>{i18n.language === 'hi' ? 'दिव्य अनुभव' : 'Divya anubhav'}</h2>
              <p>{i18n.language === 'hi' ? 'साधकों के अनुभव साझा' : 'Experiences shared by devotees'}</p>
            </div>
            <div className={styles.testimonials}>
              {[content.paragraph5, content.paragraph1, content.paragraph2].map((text, idx) => (
                <div key={idx} className={styles.testimonialCard}>
                  <div className={styles.avatar}>{String.fromCharCode(65 + idx)}</div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2>FAQ</h2>
              <p>{i18n.language === 'hi' ? 'सामान्य प्रश्न' : 'Common questions'}</p>
            </div>
            <div className={styles.faqList}>
              {faqs.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.ctaBanner}>
            <div>
              <h3>{i18n.language === 'hi' ? 'दिव्य आंदोलन से जुड़ें' : 'Join the divine movement'}</h3>
              <p>{i18n.language === 'hi' ? 'दैनिक अपडेट हेतु व्हाट्सएप समूह से जुड़ें' : 'Join the WhatsApp group for daily updates'}</p>
            </div>
            <button className={styles.primaryBtn}>{i18n.language === 'hi' ? 'समूह में जुड़ें' : 'Join WhatsApp group'}</button>
          </section>
        </div>
      </section>
    </main>
  );
}
