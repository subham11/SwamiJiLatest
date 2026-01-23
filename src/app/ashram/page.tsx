'use client';

import { NavBar } from '@/components/NavBar';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

// Ashram image gallery data
const ashramImages = [
  {
    id: 1,
    src: '/images/ashram/AshramHawan_01.jpeg',
    alt: 'Ashram Hawan Ceremony',
  },
  {
    id: 2,
    src: '/images/ashram/AshramHawan_02.jpeg',
    alt: 'Sacred Fire Ritual',
  },
  {
    id: 3,
    src: '/images/ashram/AshramHawan_03.jpeg',
    alt: 'Om Symbol at Ashram',
  },
];

export default function AshramPage() {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<typeof ashramImages[0] | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  // Handle modal open
  const openModal = useCallback((image: typeof ashramImages[0]) => {
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
    if (!selectedImage) return;
    const currentIndex = ashramImages.findIndex(img => img.id === selectedImage.id);
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? ashramImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === ashramImages.length - 1 ? 0 : currentIndex + 1;
    }
    setImageLoaded(false);
    setSelectedImage(ashramImages[newIndex]);
  }, [selectedImage]);

  const content = {
    title: isHindi ? 'स्वामी रुपेश्वरानंद आश्रम निवास' : 'Swami Rupeshwaranand Ashram Niwas',
    subtitle: isHindi 
      ? 'आध्यात्मिक विकास और आंतरिक शांति का केंद्र' 
      : 'A Sanctuary for Spiritual Growth and Inner Peace',
    galleryTitle: isHindi ? 'आश्रम की झलकियाँ' : 'Glimpses of Ashram',
    
    // Important Notice Section
    noticeTitle: isHindi
      ? 'एक महत्वपूर्ण सूचना एवं निवेदन'
      : 'An Important Notice and Request',
    noticeSubtitle: isHindi
      ? 'स्वामी रुपेश्वरानंद आश्रम में आनेवाले श्रध्दालुओ, शिष्य-शिष्याओं, साधको, यज्ञमान आदि के आवास हेतु सत्संग हॉल, ध्यान कक्ष एवं आवास व्यवस्था के निर्माण हेतु'
      : 'For the construction of Satsang Hall, Meditation Room and Accommodation for devotees, disciples, seekers, and Yajman visiting Swami Rupeshwaranand Ashram',
    
    paragraph1: isHindi
      ? 'इस वर्ष स्वामी रुपेश्वरानंद आश्रम (श्री पोताम्बरा पीठ, बलुआघाट) में बाहर से आनेवाले श्रध्दालुओ के निमित 1600 sqft के दो हॉल तथा 20×10 के 6 कमरों का निर्माण करने का लक्ष्य रखा गया है। सत्संग हॉल बनाने का उद्देश्य है कि, अब आश्रम पर नियमित रूप से ध्यान साधना शिविर, मंत्र साधना शिविर का आयोजन होता रहे और साधको के लिए भी प्रत्यक्ष प्रशिक्षण शिविरों का आयोजन होता रहे।'
      : 'This year, Swami Rupeshwaranand Ashram (Shri Potambara Peeth, Baluaghat) has set a goal to construct two halls of 1600 sqft and 6 rooms of 20×10 for visiting devotees. The purpose of building the Satsang Hall is to regularly organize meditation camps, mantra sadhana camps, and direct training camps for seekers at the ashram.',
    
    paragraph2: isHindi
      ? 'साथ ही कमरो मे आश्रम के प्रति आजीवन अथवा अल्पकालिक समय के लिए समर्पित आश्रम सेवक कार्यकर्ताओं के लिए आजीवन आवास और भोजन आदि व्यवस्था बनी रहे। साथ ही कुछ ब्रह्मचारी और वानप्रस्थ आश्रम के लिए आएं श्रध्दालुओ के लिए भी व्यवस्था बनाई जा सके।'
      : 'The rooms will provide lifelong accommodation and food arrangements for ashram workers dedicated for life or short-term periods. Additionally, arrangements can be made for Brahmacharis and devotees coming for Vanaprastha Ashram.',
    
    paragraph3: isHindi
      ? 'बाहर से आश्रम के कार्यक्रम में सहभागी श्रध्दालुओ के लिए भी व्यवस्था आश्रम मे ही बनाई जा सके, इस निमित भी यह निर्माण कार्य आवश्यक है। इस निर्माण कार्य में 50-60 लाख का निर्माण व्यय लगेगा। अतः आश्रम के प्रति श्रध्दावान सभी श्रध्दालुओ को इस निर्माण कार्य मे यथाशक्ति दान सहयोग करना चाहिए। क्योंकि यह सार्वजनिक कल्याण के निमित है।'
      : 'This construction is also necessary to accommodate devotees participating in ashram programs from outside. The construction will cost approximately 50-60 lakhs. Therefore, all faithful devotees should contribute donations according to their capacity for this construction work, as it is for public welfare.',
    
    donationAmounts: isHindi
      ? 'अतः ऐसे सभी श्रध्दालु दान सहयोगी इस निर्माण कार्य मे निम्नलिखित माध्यम से ₹5,100/-, ₹11,000/-, ₹21,000/-, ₹51,000/- अथवा एक लाख रूपये दान सहयोग के रूप मे भेज सकते है।'
      : 'All faithful devotees can send donations of ₹5,100/-, ₹11,000/-, ₹21,000/-, ₹51,000/- or One Lakh Rupees through the following means.',
    
    bankDetailsTitle: isHindi ? 'दान हेतु बैंक खाता संख्या' : 'Bank Account Details for Donation',
    
    taxBenefit: isHindi
      ? 'उपरोक्त ऑनलाइन दान Brahmavadini Foundation के माध्यम से Swami Rupeshwaranand Ashram एवं श्री पीताम्बरा सिध्दपीठ के सेवा कार्य में सहयोग के रूप में प्राप्त होगा! श्रद्धालु को 80G आयकर में छुट प्राप्त होगी!'
      : 'Online donations through Brahmavadini Foundation will support the service work of Swami Rupeshwaranand Ashram and Shri Pitambara Siddhpeeth! Devotees will receive 80G income tax exemption!',
    
    contactNote: isHindi
      ? 'आयकर में छुट प्राप्ति हेतु अथवा दान सहयोग भेजने में कोई समस्या आ रही हो तो swamirupeshwar@gmail.com पर ईमेल करे अथवा 981 77 77 108 पर व्हाट्सएप मेसेज भेजे!'
      : 'For income tax exemption or any issues sending donations, email swamirupeshwar@gmail.com or send WhatsApp message to 981 77 77 108!',
    
    specialNote: isHindi
      ? '80G के अंतर्गत आयकर छूट पाने के लिए विशेष दान सहयोगी 981 7777 108 पर वाट्सएप संदेश भेजे।'
      : 'For 80G income tax exemption, special donors please send WhatsApp message to 981 7777 108.',
  };

  return (
    <main id="main-content" className={styles.container}>
      <NavBar />

      {/* Image Gallery Section */}
      <section className={styles.gallerySection} ref={galleryRef}>
        <h2 className={`${styles.galleryTitle} ${isVisible ? styles.fadeInUp : ''}`}>
          {content.galleryTitle}
        </h2>
        <div className={`${styles.galleryGrid} ${isVisible ? styles.fadeInUp : ''}`}>
          {ashramImages.map((img, index) => (
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
            </div>
          ))}
        </div>
      </section>

      {/* Content Section - Important Notice */}
      <section className={styles.contentSection}>
        <div className={styles.contentWrapper}>
          {/* Notice Header */}
          <div className={styles.noticeHeader}>
            <h2 className={styles.noticeTitle}>{content.noticeTitle}</h2>
            <p className={styles.noticeSubtitle}>{content.noticeSubtitle}</p>
          </div>

          {/* Main Content */}
          <p className={styles.paragraph}>{content.paragraph1}</p>
          <p className={styles.paragraph}>{content.paragraph2}</p>
          <p className={styles.paragraphHighlight}>{content.paragraph3}</p>
          
          {/* Donation Amounts */}
          <p className={styles.donationAmounts}>{content.donationAmounts}</p>

          {/* Bank Details Card */}
          <div className={styles.bankCard}>
            <h3 className={styles.bankTitle}>{content.bankDetailsTitle}</h3>
            <div className={styles.bankDetails}>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>{isHindi ? 'खाता नाम' : 'Account Name'}</span>
                <span className={styles.bankValue}>SWAMI RUPESHWARANAND</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>{isHindi ? 'बैंक' : 'Bank'}</span>
                <span className={styles.bankValue}>STATE BANK OF INDIA</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>{isHindi ? 'खाता संख्या' : 'Account No.'}</span>
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
            <h3 className={styles.contactTitle}>{isHindi ? 'ऑनलाइन दान के अन्य माध्यम' : 'Other Online Donation Methods'}</h3>
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
                <span className={styles.contactLabel}>{isHindi ? 'वेबसाइट' : 'Website'}</span>
                <a href="https://swamirupeshwaranand.co/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  swamirupeshwaranand.co
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>{isHindi ? 'संपर्क' : 'Contact'}</span>
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

          {/* Tax Benefit Notice */}
          <div className={styles.taxBenefit}>
            <p>{content.taxBenefit}</p>
            <p className={styles.contactNote}>{content.contactNote}</p>
          </div>

          {/* Special Note */}
          <p className={styles.specialNote}>{content.specialNote}</p>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection} aria-label="Ashram location">
        <div className={styles.mapContainer}>
          <iframe
            title="Swami Rupeshwaranand Ashram Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.8!2d75.78!3d26.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSwami%20Rupeshwaranand%20Ashram!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="500"
            style={{ border: 0 } as React.CSSProperties}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close modal">
              ✕
            </button>

            {/* Navigation Arrows */}
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

            {/* Image Container with Loading Animation */}
            <div className={styles.modalImageContainer}>
              {/* Loading Spinner */}
              {!imageLoaded && (
                <div className={styles.modalLoader}>
                  <div className={styles.loaderSpinner} />
                  <div className={styles.loaderPulse} />
                </div>
              )}
              
              {/* Main Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className={`${styles.modalImage} ${imageLoaded ? styles.modalImageLoaded : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Image Caption */}
            <p className={`${styles.modalCaption} ${imageLoaded ? styles.modalCaptionVisible : ''}`}>
              {selectedImage.alt}
            </p>

            {/* Image Counter */}
            <div className={styles.modalCounter}>
              {ashramImages.findIndex(img => img.id === selectedImage.id) + 1} / {ashramImages.length}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
