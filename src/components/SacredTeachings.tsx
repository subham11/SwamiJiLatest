'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const teachings = [
  {
    id: 1,
    iconEn: "🕉️",
    titleEn: "Path to Inner Peace",
    titleHi: "आंतरिक शांति का मार्ग",
    descEn: "Discover the ancient wisdom of meditation and spiritual practices that lead to lasting peace and harmony in your life.",
    descHi: "ध्यान और आध्यात्मिक प्रथाओं की प्राचीन बुद्धि की खोज करें जो आपके जीवन में स्थायी शांति और सद्भाव की ओर ले जाती है।",
    fullContentEn: "Through the practice of daily meditation, you can achieve a state of profound inner peace. Learn techniques of breath control, mindfulness, and deep contemplation that have been passed down through generations. These sacred practices will help you find tranquility amidst the chaos of modern life, bringing balance to your mind, body, and spirit. Discover the path to lasting happiness and spiritual fulfillment.",
    fullContentHi: "दैनिक ध्यान के अभ्यास के माध्यम से, आप गहन आंतरिक शांति की स्थिति प्राप्त कर सकते हैं। श्वास नियंत्रण, माइंडफुलनेस और गहन चिंतन की तकनीकें सीखें जो पीढ़ियों से चली आ रही हैं। ये पवित्र प्रथाएं आपको आधुनिक जीवन की अराजकता के बीच शांति पाने में मदद करेंगी, आपके मन, शरीर और आत्मा में संतुलन लाएंगी।"
  },
  {
    id: 2,
    iconEn: "📿",
    titleEn: "Divine Mantras",
    titleHi: "दिव्य मंत्र",
    descEn: "Learn powerful mantras and chants that connect you with divine energy and transform your spiritual journey.",
    descHi: "शक्तिशाली मंत्रों और जपों को सीखें जो आपको दिव्य ऊर्जा से जोड़ते हैं और आपकी आध्यात्मिक यात्रा को रूपांतरित करते हैं।",
    fullContentEn: "Sacred mantras carry the vibrations of divine energy. When chanted with devotion and proper pronunciation, they have the power to transform your consciousness and connect you with higher realms. Learn the significance of each syllable, the proper timing, and the deep spiritual meaning behind these ancient sounds. Regular practice of mantra chanting purifies the mind and opens channels to divine grace.",
    fullContentHi: "पवित्र मंत्र दिव्य ऊर्जा के कंपन को धारण करते हैं। जब भक्ति और उचित उच्चारण के साथ जप किया जाता है, तो उनमें आपकी चेतना को रूपांतरित करने और आपको उच्च क्षेत्रों से जोड़ने की शक्ति होती है। प्रत्येक अक्षर का महत्व, उचित समय और इन प्राचीन ध्वनियों के पीछे की गहरी आध्यात्मिक अर्थ सीखें।"
  },
  {
    id: 3,
    iconEn: "🙏",
    titleEn: "Daily Rituals",
    titleHi: "दैनिक अनुष्ठान",
    descEn: "Embrace sacred daily practices that bring discipline, devotion, and divine blessings into your everyday life.",
    descHi: "पवित्र दैनिक प्रथाओं को अपनाएं जो आपके रोजमर्रा के जीवन में अनुशासन, भक्ति और दिव्य आशीर्वाद लाती हैं।",
    fullContentEn: "Establishing a consistent spiritual routine creates a foundation for divine grace to flow into your life. Begin each day with prayer, light a sacred lamp, offer gratitude, and maintain purity of thought and action. These simple yet powerful rituals create positive energy in your home and life. Learn the proper way to perform morning prayers, evening aarti, and other daily observances that keep you connected to the divine throughout your day.",
    fullContentHi: "एक सुसंगत आध्यात्मिक दिनचर्या स्थापित करना आपके जीवन में दिव्य कृपा के प्रवाह के लिए एक नींव बनाता है। प्रत्येक दिन की शुरुआत प्रार्थना से करें, पवित्र दीपक जलाएं, कृतज्ञता व्यक्त करें, और विचार और कार्य की पवित्रता बनाए रखें। ये सरल लेकिन शक्तिशाली अनुष्ठान आपके घर और जीवन में सकारात्मक ऊर्जा बनाते हैं।"
  },
  {
    id: 4,
    iconEn: "🪔",
    titleEn: "Spiritual Awakening",
    titleHi: "आध्यात्मिक जागृति",
    descEn: "Awaken your consciousness and realize your true divine nature through guided teachings and enlightenment.",
    descHi: "निर्देशित शिक्षाओं और ज्ञानोदय के माध्यम से अपनी चेतना को जगाएं और अपने वास्तविक दिव्य स्वभाव को साकार करें।",
    fullContentEn: "True spiritual awakening is the realization of your divine essence. Through systematic study of sacred texts, contemplation, and guidance from enlightened teachers, you can transcend the limitations of the ego and experience your true nature. This journey involves self-inquiry, letting go of attachments, and cultivating pure awareness. Discover the eternal truth that lies within you and experience the bliss of self-realization.",
    fullContentHi: "सच्ची आध्यात्मिक जागृति आपके दिव्य सार की प्राप्ति है। पवित्र ग्रंथों के व्यवस्थित अध्ययन, चिंतन और प्रबुद्ध शिक्षकों के मार्गदर्शन के माध्यम से, आप अहंकार की सीमाओं को पार कर सकते हैं और अपने वास्तविक स्वभाव का अनुभव कर सकते हैं। इस यात्रा में आत्म-जांच, आसक्तियों को छोड़ना और शुद्ध जागरूकता विकसित करना शामिल है।"
  }
];

export function SacredTeachings() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';
  const [selectedTeaching, setSelectedTeaching] = useState<typeof teachings[0] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = (teaching: typeof teachings[0]) => {
    setSelectedTeaching(teaching);
    setIsAnimating(true);
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedTeaching(null);
    }, 300);
  };

  return (
    <>
      <section className="sacredTeachings">
        <div className="teachingsContainer">
          <div className="teachingsHeader">
            <h2 className="sectionTitle">{t('teachings.title')}</h2>
            <p className="sectionSubtitle">{t('teachings.subtitle')}</p>
          </div>

          <div className="teachingsGrid">
            {teachings.map((teaching) => (
              <div 
                key={teaching.id} 
                className="teachingCard"
                onClick={() => handleCardClick(teaching)}
              >
                <div className="teachingIcon">{teaching.iconEn}</div>
                <h3 className="teachingTitle">
                  {locale === 'hi' ? teaching.titleHi : teaching.titleEn}
                </h3>
                <p className="teachingDesc">
                  {locale === 'hi' ? teaching.descHi : teaching.descEn}
                </p>
                <button className="teachingBtn">
                  {locale === 'hi' ? 'और जानें' : 'Learn More'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedTeaching && (
        <div 
          className={`teachingModal ${isAnimating ? 'active' : ''}`}
          onClick={handleCloseModal}
        >
          <div 
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modalClose" onClick={handleCloseModal}>×</button>
            <div className="modalIcon">{selectedTeaching.iconEn}</div>
            <h2 className="modalTitle">
              {locale === 'hi' ? selectedTeaching.titleHi : selectedTeaching.titleEn}
            </h2>
            <p className="modalText">
              {locale === 'hi' ? selectedTeaching.fullContentHi : selectedTeaching.fullContentEn}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
