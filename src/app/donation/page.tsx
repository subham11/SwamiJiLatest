'use client';

import { NavBar } from '@/components/NavBar';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

// Interface for gallery images from API
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

// Donation amount options
const donationAmountsOnetime = [501, 1100, 2100, 5100, 11000, 21000];
const donationAmountsMonthly = [300, 500, 1000, 2100];

export default function DonationPage() {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const locale = isHindi ? 'hi' : 'en';
  
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('onetime');
  const galleryRef = useRef<HTMLDivElement>(null);

  // API content state
  const [pageContent, setPageContent] = useState<{
    hero: { title: string; subtitle: string; backgroundImage: string };
    guruMessage: { title: string; message: string; guruName: string };
    gallery: { title: string; images: GalleryImage[] };
    intro: { text: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch page content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/page-content/${locale}/donation`);
        if (res.ok) {
          const data = await res.json();
          const components = data.components || [];
          
          const heroComp = components.find((c: any) => c.id === 'donation-hero');
          const guruComp = components.find((c: any) => c.id === 'donation-guruMessage');
          const galleryComp = components.find((c: any) => c.id === 'donation-gallery');
          const introComp = components.find((c: any) => c.id === 'donation-intro');

          setPageContent({
            hero: heroComp?.content || getDefaultContent().hero,
            guruMessage: guruComp?.content || getDefaultContent().guruMessage,
            gallery: galleryComp?.content || getDefaultContent().gallery,
            intro: introComp?.content || getDefaultContent().intro,
          });
        } else {
          setPageContent(getDefaultContent());
        }
      } catch (error) {
        console.error('Failed to fetch donation page content:', error);
        setPageContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [locale]);

  // Default content fallback
  const getDefaultContent = () => ({
    hero: {
      title: isHindi ? 'आश्रम दान' : 'Ashram Donation',
      subtitle: isHindi 
        ? 'आपका छोटा सा सहयोग, किसी के जीवन में बड़ा परिवर्तन ला सकता है' 
        : 'Your small contribution can bring a big change in someone\'s life',
      backgroundImage: '/images/donation/s1.png'
    },
    guruMessage: {
      title: isHindi ? 'गुरुदेव का संदेश' : 'Message from Gurudev',
      message: isHindi
        ? '"सेवा वही सच्ची साधना है, जिसमें अपना नहीं, अपितु समाज का कल्याण हो। आपका प्रत्येक दान किसी न किसी जीवन में प्रकाश बनकर आता है।"'
        : '"True worship is service, where not our own but society\'s welfare is the goal. Every donation you make becomes a light in someone\'s life."',
      guruName: isHindi 
        ? '— परम पूज्य गुरुदेव स्वामी रुपेश्वरानंद जी महाराज'
        : '— Param Pujya Gurudev Swami Rupeshwaranand Ji Maharaj'
    },
    gallery: {
      title: isHindi ? 'सेवा कार्यों की झलकियाँ' : 'Glimpses of Seva Activities',
      images: [
        { id: 1, src: '/images/donation/s1.png', alt: isHindi ? 'सेवा कार्य' : 'Seva Activities' },
        { id: 2, src: '/images/donation/s2.png', alt: isHindi ? 'सामुदायिक सेवा' : 'Community Service' },
        { id: 3, src: '/images/donation/s3.png', alt: isHindi ? 'आश्रम गतिविधियाँ' : 'Ashram Activities' },
        { id: 4, src: '/images/donation/s4.png', alt: isHindi ? 'आध्यात्मिक कार्यक्रम' : 'Spiritual Programs' },
      ]
    },
    intro: {
      text: isHindi
        ? 'स्वामी रुपेश्वरानंद आश्रम सेवा, साधना और संस्कार का केंद्र है। यहाँ निःशुल्क भोजन, शिक्षा, चिकित्सा और आध्यात्मिक मार्गदर्शन दिया जाता है। आपके दान से यह सेवा निरंतर चलती रहती है।'
        : 'Swami Rupeshwaranand Ashram is a center for service, spiritual practice, and values. Free food, education, medical aid, and spiritual guidance are provided here. Your donations keep this service running.'
    }
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
  });

  // Intersection observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Get gallery images from content
  const galleryImages = pageContent?.gallery?.images || [];

  // Handle modal open
  const openModal = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    setImageLoaded(false);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Handle modal close
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedImage(null);
    setImageLoaded(false);
    document.body.style.overflow = '';
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal]);

  // Navigate between images in modal
  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage || galleryImages.length === 0) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    }
    setImageLoaded(false);
    setSelectedImage(galleryImages[newIndex]);
  }, [selectedImage, galleryImages]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    return customAmount ? parseInt(customAmount, 10) : selectedAmount;
  };

  // Show loading state
  if (loading) {
    return (
      <main id="main-content" className={styles.container}>
        <NavBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className={styles.loaderSpinner} style={{ margin: '0 auto 1rem' }} />
            <p>{isHindi ? 'लोड हो रहा है...' : 'Loading...'}</p>
          </div>
        </div>
      </main>
    );
  }

  const content = {
    // From API
    title: pageContent?.hero?.title || (isHindi ? 'आश्रम दान' : 'Ashram Donation'),
    subtitle: pageContent?.hero?.subtitle || (isHindi 
      ? 'आपका छोटा सा सहयोग, किसी के जीवन में बड़ा परिवर्तन ला सकता है' 
      : 'Your small contribution can bring a big change in someone\'s life'),
    backgroundImage: pageContent?.hero?.backgroundImage || '/images/donation/s1.png',
    galleryTitle: pageContent?.gallery?.title || (isHindi ? 'सेवा कार्यों की झलकियाँ' : 'Glimpses of Seva Activities'),
    
    // Guru Message - From API
    guruMessageTitle: pageContent?.guruMessage?.title || (isHindi ? 'गुरुदेव का संदेश' : 'Message from Gurudev'),
    guruMessage: pageContent?.guruMessage?.message || (isHindi
      ? '"सेवा वही सच्ची साधना है, जिसमें अपना नहीं, अपितु समाज का कल्याण हो। आपका प्रत्येक दान किसी न किसी जीवन में प्रकाश बनकर आता है।"'
      : '"True worship is service, where not our own but society\'s welfare is the goal. Every donation you make becomes a light in someone\'s life."'),
    guruName: pageContent?.guruMessage?.guruName || (isHindi 
      ? '— परम पूज्य गुरुदेव स्वामी रुपेश्वरानंद जी महाराज'
      : '— Param Pujya Gurudev Swami Rupeshwaranand Ji Maharaj'),

    // Intro - From API
    intro: pageContent?.intro?.text || (isHindi
      ? 'स्वामी रुपेश्वरानंद आश्रम सेवा, साधना और संस्कार का केंद्र है। यहाँ निःशुल्क भोजन, शिक्षा, चिकित्सा और आध्यात्मिक मार्गदर्शन दिया जाता है। आपके दान से यह सेवा निरंतर चलती रहती है।'
      : 'Swami Rupeshwaranand Ashram is a center for service, spiritual practice, and values. Free food, education, medical aid, and spiritual guidance are provided here. Your donations keep this service running.'),

    // Donation Types
    onetimeDonation: isHindi ? 'एकमुश्त दान' : 'One-time Donation',
    monthlyDonation: isHindi ? 'मासिक दान' : 'Monthly Donation',
    monthlyDesc: isHindi 
      ? 'आप हर माह निश्चित राशि दान कर आश्रम की नियमित सेवा में सहभागी बन सकते हैं।'
      : 'You can become a regular contributor to ashram services by donating a fixed amount every month.',

    // Form Labels
    selectAmount: isHindi ? 'दान की राशि चुनें' : 'Select Donation Amount',
    otherAmount: isHindi ? 'अन्य राशि' : 'Other Amount',
    enterAmount: isHindi ? '₹ राशि दर्ज करें' : 'Enter ₹ amount',
    donorDetails: isHindi ? 'दाता विवरण' : 'Donor Details',
    fullName: isHindi ? 'पूरा नाम' : 'Full Name',
    mobileNumber: isHindi ? 'मोबाइल नंबर' : 'Mobile Number',
    emailOptional: isHindi ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)',
    donateNow: isHindi ? 'दान करें' : 'Donate Now',
    startMonthly: isHindi ? 'मासिक दान प्रारंभ करें' : 'Start Monthly Donation',
    perMonth: isHindi ? '/ माह' : '/ month',

    // Usage Section
    usageTitle: isHindi ? 'आपके दान का उपयोग' : 'How Your Donation is Used',
    usageItems: isHindi
      ? [
          { icon: '🍲', text: 'निःशुल्क भोजन सेवा' },
          { icon: '📚', text: 'बच्चों की शिक्षा' },
          { icon: '🏥', text: 'चिकित्सा सहायता' },
          { icon: '🕉️', text: 'आध्यात्मिक कार्यक्रम' },
          { icon: '🏠', text: 'आश्रम संचालन' },
          { icon: '🙏', text: 'साधना शिविर' },
        ]
      : [
          { icon: '🍲', text: 'Free Food Service' },
          { icon: '📚', text: 'Children\'s Education' },
          { icon: '🏥', text: 'Medical Aid' },
          { icon: '🕉️', text: 'Spiritual Programs' },
          { icon: '🏠', text: 'Ashram Operations' },
          { icon: '🙏', text: 'Meditation Camps' },
        ],

    // Tax Benefits
    taxTitle: isHindi ? 'PAN / 80G कर लाभ' : 'PAN / 80G Tax Benefits',
    taxDesc: isHindi
      ? 'स्वामी रुपेश्वरानंद आश्रम आयकर अधिनियम की धारा 80G के अंतर्गत पंजीकृत है। दान करने पर आपको कर छूट का लाभ प्राप्त हो सकता है।'
      : 'Swami Rupeshwaranand Ashram is registered under Section 80G of the Income Tax Act. You may receive tax exemption benefits on your donations.',
    trustName: isHindi ? 'ट्रस्ट का नाम' : 'Trust Name',
    panLabel: 'PAN',
    registration80G: isHindi ? '80G रजिस्ट्रेशन' : '80G Registration',
    available: isHindi ? 'उपलब्ध' : 'Available',
    receiptLabel: isHindi ? 'रसीद' : 'Receipt',
    receiptDesc: isHindi ? 'ईमेल / WhatsApp पर भेजी जाएगी' : 'Will be sent via Email / WhatsApp',

    // Bank Details
    bankDetailsTitle: isHindi ? 'दान हेतु बैंक खाता विवरण' : 'Bank Account Details for Donation',
    accountName: isHindi ? 'खाता नाम' : 'Account Name',
    bank: isHindi ? 'बैंक' : 'Bank',
    accountNo: isHindi ? 'खाता संख्या' : 'Account No.',

    // Other Payment Methods
    otherMethods: isHindi ? 'ऑनलाइन दान के अन्य माध्यम' : 'Other Online Donation Methods',
    website: isHindi ? 'वेबसाइट' : 'Website',
    contact: isHindi ? 'संपर्क' : 'Contact',

    // Tax Benefit Note
    taxBenefitNote: isHindi
      ? 'उपरोक्त ऑनलाइन दान Brahmavadini Foundation के माध्यम से Swami Rupeshwaranand Ashram एवं श्री पीताम्बरा सिध्दपीठ के सेवा कार्य में सहयोग के रूप में प्राप्त होगा! श्रद्धालु को 80G आयकर में छुट प्राप्त होगी!'
      : 'Online donations through Brahmavadini Foundation will support the service work of Swami Rupeshwaranand Ashram and Shri Pitambara Siddhpeeth! Devotees will receive 80G income tax exemption!',
    
    contactNote: isHindi
      ? 'आयकर में छुट प्राप्ति हेतु अथवा दान सहयोग भेजने में कोई समस्या आ रही हो तो swamirupeshwar@gmail.com पर ईमेल करे अथवा 981 77 77 108 पर व्हाट्सएप मेसेज भेजे!'
      : 'For income tax exemption or any issues sending donations, email swamirupeshwar@gmail.com or send WhatsApp message to 981 77 77 108!',
  };

  return (
    <main id="main-content" className={styles.container}>
      <NavBar />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{content.title}</h1>
          <p className={styles.heroSubtitle}>{content.subtitle}</p>
        </div>
      </section>

      {/* Guru Message Section */}
      <section className={styles.guruSection}>
        <div className={styles.guruCard}>
          <h2 className={styles.guruTitle}>{content.guruMessageTitle}</h2>
          <p className={styles.guruMessage}>{content.guruMessage}</p>
          <p className={styles.guruName}>{content.guruName}</p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className={styles.gallerySection} ref={galleryRef}>
        <h2 className={`${styles.galleryTitle} ${isVisible ? styles.fadeInUp : ''}`}>
          {content.galleryTitle}
        </h2>
        <div className={`${styles.galleryGrid} ${isVisible ? styles.fadeInUp : ''}`}>
          {galleryImages.map((img, index) => (
            <div
              key={img.id}
              className={styles.galleryCard}
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => openModal(img)}
            >
              <div className={styles.galleryImageWrapper}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className={styles.galleryImage}
                  loading="lazy"
                />
                <div className={styles.galleryImageOverlay}>
                  <span className={styles.galleryImageIcon}>🔍</span>
                </div>
              </div>
              <p className={styles.galleryCaption}>{img.alt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro Text */}
      <section className={styles.introSection}>
        <p className={styles.introText}>{content.intro}</p>
      </section>

      {/* Donation Form Section */}
      <section className={styles.donationSection}>
        <div className={styles.donationGrid}>
          {/* Donation Type Toggle */}
          <div className={styles.donationTypeCard}>
            <div className={styles.typeToggle}>
              <button
                className={`${styles.typeBtn} ${donationType === 'onetime' ? styles.typeBtnActive : ''}`}
                onClick={() => setDonationType('onetime')}
              >
                {content.onetimeDonation}
              </button>
              <button
                className={`${styles.typeBtn} ${donationType === 'monthly' ? styles.typeBtnActive : ''}`}
                onClick={() => setDonationType('monthly')}
              >
                {content.monthlyDonation}
              </button>
            </div>
            {donationType === 'monthly' && (
              <p className={styles.monthlyDesc}>{content.monthlyDesc}</p>
            )}
          </div>

          {/* Amount Selection Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{content.selectAmount}</h3>
            <div className={styles.amountGrid}>
              {(donationType === 'onetime' ? donationAmountsOnetime : donationAmountsMonthly).map((amount) => (
                <button
                  key={amount}
                  className={`${styles.amountBtn} ${selectedAmount === amount ? styles.amountBtnActive : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  ₹{amount.toLocaleString('en-IN')}
                  {donationType === 'monthly' && <span className={styles.perMonth}>{content.perMonth}</span>}
                </button>
              ))}
            </div>
            <div className={styles.customAmount}>
              <label className={styles.label}>{content.otherAmount}</label>
              <input
                type="number"
                className={styles.input}
                placeholder={content.enterAmount}
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
            </div>
          </div>

          {/* Donor Details Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{content.donorDetails}</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>{content.fullName}</label>
              <input
                type="text"
                className={styles.input}
                placeholder={content.fullName}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{content.mobileNumber}</label>
              <input
                type="tel"
                className={styles.input}
                placeholder={content.mobileNumber}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{content.emailOptional}</label>
              <input
                type="email"
                className={styles.input}
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <button className={styles.donateBtn} disabled={!getFinalAmount()}>
              {donationType === 'monthly' ? content.startMonthly : content.donateNow}
              {getFinalAmount() && ` - ₹${getFinalAmount()?.toLocaleString('en-IN')}`}
              {donationType === 'monthly' && getFinalAmount() && content.perMonth}
            </button>
          </div>

          {/* Usage Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{content.usageTitle}</h3>
            <ul className={styles.usageList}>
              {content.usageItems.map((item, index) => (
                <li key={index} className={styles.usageItem}>
                  <span className={styles.usageIcon}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bank Details Section */}
      <section className={styles.bankSection}>
        <div className={styles.bankCard}>
          <h3 className={styles.bankTitle}>{content.bankDetailsTitle}</h3>
          <div className={styles.bankDetails}>
            <div className={styles.bankRow}>
              <span className={styles.bankLabel}>{content.accountName}</span>
              <span className={styles.bankValue}>SWAMI RUPESHWARANAND</span>
            </div>
            <div className={styles.bankRow}>
              <span className={styles.bankLabel}>{content.bank}</span>
              <span className={styles.bankValue}>STATE BANK OF INDIA</span>
            </div>
            <div className={styles.bankRow}>
              <span className={styles.bankLabel}>{content.accountNo}</span>
              <span className={styles.bankValue}>3087 2366 323</span>
            </div>
            <div className={styles.bankRow}>
              <span className={styles.bankLabel}>IFSC Code</span>
              <span className={styles.bankValue}>SBIN0011241</span>
            </div>
          </div>
        </div>

        {/* UPI & Contact Details */}
        <div className={styles.contactCard}>
          <h3 className={styles.contactTitle}>{content.otherMethods}</h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Google Pay</span>
              <span className={styles.contactValue}>76072 33230 / 981 7777 108</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>UPI ID</span>
              <span className={styles.contactValue}>swamirupeshwar@oksbi</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{content.website}</span>
              <a href="https://swamirupeshwaranand.co/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                swamirupeshwaranand.co
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>{content.contact}</span>
              <span className={styles.contactValue}>7607 233 230</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <a href="mailto:swamirupeshwar@gmail.com" className={styles.contactLink}>
                swamirupeshwar@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Benefits Section */}
      <section className={styles.taxSection}>
        <div className={styles.taxCard}>
          <h3 className={styles.taxTitle}>{content.taxTitle}</h3>
          <p className={styles.taxDesc}>{content.taxDesc}</p>
          <ul className={styles.taxList}>
            <li>
              <strong>{content.trustName}:</strong> स्वामी रुपेश्वरानंद आश्रम / Swami Rupeshwaranand Ashram
            </li>
            <li>
              <strong>{content.panLabel}:</strong> AAAAA0000A
            </li>
            <li>
              <strong>{content.registration80G}:</strong> {content.available}
            </li>
            <li>
              <strong>{content.receiptLabel}:</strong> {content.receiptDesc}
            </li>
          </ul>
        </div>

        {/* Tax Benefit Notes */}
        <div className={styles.taxBenefitNote}>
          <p>{content.taxBenefitNote}</p>
          <p className={styles.contactNote}>{content.contactNote}</p>
        </div>
      </section>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close modal">
              ✕
            </button>

            <button 
              className={`${styles.modalNav} ${styles.modalNavPrev}`} 
              onClick={() => navigateImage('prev')}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              className={`${styles.modalNav} ${styles.modalNavNext}`} 
              onClick={() => navigateImage('next')}
              aria-label="Next image"
            >
              ›
            </button>

            <div className={styles.modalImageContainer}>
              {!imageLoaded && (
                <div className={styles.modalLoader}>
                  <div className={styles.loaderSpinner} />
                  <div className={styles.loaderPulse} />
                </div>
              )}
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className={`${styles.modalImage} ${imageLoaded ? styles.modalImageLoaded : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            <p className={`${styles.modalCaption} ${imageLoaded ? styles.modalCaptionVisible : ''}`}>
              {selectedImage.alt}
            </p>

            <div className={styles.modalCounter}>
              {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
