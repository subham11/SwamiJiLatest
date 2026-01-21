'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Locale = 'en' | 'hi';

interface TeachingCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  fullContent: string;
  buttonText: string;
  buttonLink: string;
}

interface TeachingsContent {
  title: string;
  subtitle: string;
  cards: TeachingCard[];
}

// Default content (used as fallback)
const defaultContent: Record<Locale, TeachingsContent> = {
  en: {
    title: 'Sacred Teachings',
    subtitle: 'Timeless wisdom for modern living',
    cards: [
      {
        id: 1,
        icon: '🕉️',
        title: 'Path to Inner Peace',
        description: 'Discover the ancient wisdom of meditation and spiritual practices that lead to lasting peace and harmony in your life.',
        fullContent: 'Through the practice of daily meditation, you can achieve a state of profound inner peace. Learn techniques of breath control, mindfulness, and deep contemplation that have been passed down through generations.',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      {
        id: 2,
        icon: '📿',
        title: 'Divine Mantras',
        description: 'Learn powerful mantras and chants that connect you with divine energy and transform your spiritual journey.',
        fullContent: 'Sacred mantras carry the vibrations of divine energy. When chanted with devotion and proper pronunciation, they have the power to transform your consciousness and connect you with higher realms.',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      {
        id: 3,
        icon: '🙏',
        title: 'Daily Rituals',
        description: 'Embrace sacred daily practices that bring discipline, devotion, and divine blessings into your everyday life.',
        fullContent: 'Establishing a consistent spiritual routine creates a foundation for divine grace to flow into your life. Begin each day with prayer, light a sacred lamp, offer gratitude, and maintain purity of thought and action.',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      {
        id: 4,
        icon: '🪔',
        title: 'Spiritual Awakening',
        description: 'Awaken your consciousness and realize your true divine nature through guided teachings and enlightenment.',
        fullContent: 'True spiritual awakening is the realization of your divine essence. Through systematic study of sacred texts, contemplation, and guidance from enlightened teachers, you can transcend the limitations of the ego.',
        buttonText: 'Learn More',
        buttonLink: '#'
      }
    ]
  },
  hi: {
    title: 'पवित्र शिक्षाएं',
    subtitle: 'आधुनिक जीवन के लिए कालातीत ज्ञान',
    cards: [
      {
        id: 1,
        icon: '🕉️',
        title: 'आंतरिक शांति का मार्ग',
        description: 'ध्यान और आध्यात्मिक प्रथाओं की प्राचीन बुद्धि की खोज करें जो आपके जीवन में स्थायी शांति और सद्भाव की ओर ले जाती है।',
        fullContent: 'दैनिक ध्यान के अभ्यास के माध्यम से, आप गहन आंतरिक शांति की स्थिति प्राप्त कर सकते हैं। श्वास नियंत्रण, माइंडफुलनेस और गहन चिंतन की तकनीकें सीखें।',
        buttonText: 'और जानें',
        buttonLink: '#'
      },
      {
        id: 2,
        icon: '📿',
        title: 'दिव्य मंत्र',
        description: 'शक्तिशाली मंत्रों और जपों को सीखें जो आपको दिव्य ऊर्जा से जोड़ते हैं और आपकी आध्यात्मिक यात्रा को रूपांतरित करते हैं।',
        fullContent: 'पवित्र मंत्र दिव्य ऊर्जा के कंपन को धारण करते हैं। जब भक्ति और उचित उच्चारण के साथ जप किया जाता है, तो उनमें आपकी चेतना को रूपांतरित करने की शक्ति होती है।',
        buttonText: 'और जानें',
        buttonLink: '#'
      },
      {
        id: 3,
        icon: '🙏',
        title: 'दैनिक अनुष्ठान',
        description: 'पवित्र दैनिक प्रथाओं को अपनाएं जो आपके रोजमर्रा के जीवन में अनुशासन, भक्ति और दिव्य आशीर्वाद लाती हैं।',
        fullContent: 'एक सुसंगत आध्यात्मिक दिनचर्या स्थापित करना आपके जीवन में दिव्य कृपा के प्रवाह के लिए एक नींव बनाता है।',
        buttonText: 'और जानें',
        buttonLink: '#'
      },
      {
        id: 4,
        icon: '🪔',
        title: 'आध्यात्मिक जागृति',
        description: 'निर्देशित शिक्षाओं और ज्ञानोदय के माध्यम से अपनी चेतना को जगाएं और अपने वास्तविक दिव्य स्वभाव को साकार करें।',
        fullContent: 'सच्ची आध्यात्मिक जागृति आपके दिव्य सार की प्राप्ति है। पवित्र ग्रंथों के व्यवस्थित अध्ययन और चिंतन के माध्यम से, आप अहंकार की सीमाओं को पार कर सकते हैं।',
        buttonText: 'और जानें',
        buttonLink: '#'
      }
    ]
  }
};

export function SacredTeachings() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<TeachingsContent>(defaultContent.en);
  const [selectedTeaching, setSelectedTeaching] = useState<TeachingCard | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const locale: Locale = i18n.language?.startsWith('hi') ? 'hi' : 'en';
      try {
        const res = await fetch(`/api/page-content/${locale}/home/sacredTeachings`, {
          next: { revalidate: 60 }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            // Normalize the content
            const normalized: TeachingsContent = {
              title: data.content.title || defaultContent[locale].title,
              subtitle: data.content.subtitle || defaultContent[locale].subtitle,
              cards: Array.isArray(data.content.cards) && data.content.cards.length > 0
                ? data.content.cards.map((card: any, idx: number) => ({
                    id: card.id || idx + 1,
                    icon: card.icon || defaultContent[locale].cards[idx]?.icon || '🕉️',
                    title: card.title || defaultContent[locale].cards[idx]?.title || '',
                    description: card.description || defaultContent[locale].cards[idx]?.description || '',
                    fullContent: card.fullContent || defaultContent[locale].cards[idx]?.fullContent || '',
                    buttonText: card.buttonText || defaultContent[locale].cards[idx]?.buttonText || 'Learn More',
                    buttonLink: card.buttonLink || defaultContent[locale].cards[idx]?.buttonLink || '#'
                  }))
                : defaultContent[locale].cards
            };
            setContent(normalized);
          } else {
            setContent(defaultContent[locale]);
          }
        } else {
          setContent(defaultContent[locale]);
        }
      } catch {
        const locale: Locale = i18n.language?.startsWith('hi') ? 'hi' : 'en';
        setContent(defaultContent[locale]);
      }
    };

    fetchContent();
  }, [i18n.language]);

  const handleCardClick = (teaching: TeachingCard) => {
    setSelectedTeaching(teaching);
    setIsAnimating(true);
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedTeaching(null);
    }, 300);
  };

  const handleButtonClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    if (link && link !== '#') {
      window.location.href = link;
    }
  };

  return (
    <>
      <section className="sacredTeachings">
        <div className="teachingsContainer">
          <div className="teachingsHeader">
            <h2 className="sectionTitle">{content.title}</h2>
            <p className="sectionSubtitle">{content.subtitle}</p>
          </div>

          <div className="teachingsGrid">
            {content.cards.map((teaching) => (
              <div 
                key={teaching.id} 
                className="teachingCard"
                onClick={() => handleCardClick(teaching)}
              >
                <div className="teachingIcon">{teaching.icon}</div>
                <h3 className="teachingTitle">{teaching.title}</h3>
                <p className="teachingDesc">{teaching.description}</p>
                <button 
                  className="teachingBtn"
                  onClick={(e) => handleButtonClick(e, teaching.buttonLink)}
                >
                  {teaching.buttonText}
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
            <div className="modalIcon">{selectedTeaching.icon}</div>
            <h2 className="modalTitle">{selectedTeaching.title}</h2>
            <p className="modalText">{selectedTeaching.fullContent}</p>
          </div>
        </div>
      )}
    </>
  );
}
