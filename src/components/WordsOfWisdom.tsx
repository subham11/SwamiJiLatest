'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface WisdomContent {
  title: string;
  subtitle: string;
  author: string;
  quotes: string[];
}

const defaultContent: Record<string, WisdomContent> = {
  en: {
    title: 'Words of Wisdom',
    subtitle: 'Daily Inspiration from Swami Ji',
    author: 'Swami Rupeshwaranand',
    quotes: [
      'The mind is everything. What you think, you become.',
      'Peace comes from within. Do not seek it without.',
      'Meditation brings wisdom; lack of meditation leaves ignorance.',
      'Your purpose in life is to find your purpose and give your whole heart to it.',
      'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.'
    ]
  },
  hi: {
    title: 'ज्ञान के मोती',
    subtitle: 'स्वामी जी से दैनिक प्रेरणा',
    author: 'स्वामी रूपेश्वरानंद',
    quotes: [
      'मन ही सब कुछ है। जो आप सोचते हैं, वही आप बन जाते हैं।',
      'शांति भीतर से आती है। इसे बाहर मत खोजो।',
      'ध्यान ज्ञान लाता है; ध्यान की कमी अज्ञानता छोड़ती है।',
      'जीवन में आपका उद्देश्य अपने उद्देश्य को खोजना और अपना पूरा दिल देना है।',
      'अतीत में मत रहो, भविष्य के सपने मत देखो, वर्तमान क्षण पर मन को केंद्रित करो।'
    ]
  }
};

export function WordsOfWisdom() {
  const { i18n } = useTranslation();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [content, setContent] = useState<WisdomContent | null>(null);
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/page-content/${locale}/home/wordsOfWisdom`);
        if (response.ok) {
          const data = await response.json();
          if (data?.content) {
            const apiContent = data.content;
            setContent({
              title: apiContent.title || defaultContent[locale].title,
              subtitle: apiContent.subtitle || defaultContent[locale].subtitle,
              author: apiContent.author || defaultContent[locale].author,
              quotes: Array.isArray(apiContent.quotes) && apiContent.quotes.length > 0
                ? apiContent.quotes
                : defaultContent[locale].quotes
            });
            return;
          }
        }
        setContent(defaultContent[locale]);
      } catch (error) {
        console.error('Failed to fetch wisdom content:', error);
        setContent(defaultContent[locale]);
      }
    };
    fetchContent();
  }, [locale]);

  // Auto-rotate quotes
  useEffect(() => {
    const quotesLength = content?.quotes?.length || 5;
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotesLength);
    }, 6000);
    return () => clearInterval(interval);
  }, [content]);

  const displayContent = content || defaultContent[locale];
  const quotesLength = displayContent.quotes.length;

  const goToNext = () => {
    setCurrentQuote((prev) => (prev + 1) % quotesLength);
  };

  const goToPrev = () => {
    setCurrentQuote((prev) => (prev - 1 + quotesLength) % quotesLength);
  };

  return (
    <section className="wordsOfWisdom">
      <div className="wisdomContainer">
        <div className="wisdomHeader">
          <h2 className="wisdomTitle">{displayContent.title}</h2>
          <p className="wisdomSubtitle">{displayContent.subtitle}</p>
        </div>
        
        <div className="quoteDisplay">
          <button 
            className="quoteNavBtn quotePrev" 
            onClick={goToPrev}
            aria-label="Previous quote"
          >
            ‹
          </button>
          
          <div className="quoteContent">
            <div className="quoteIcon">❝</div>
            <p className="quoteText" key={currentQuote}>
              {displayContent.quotes[currentQuote] || ''}
            </p>
            <div className="quoteAuthor">— {displayContent.author}</div>
          </div>

          <button 
            className="quoteNavBtn quoteNext" 
            onClick={goToNext}
            aria-label="Next quote"
          >
            ›
          </button>
        </div>

        <div className="quoteDots">
          {displayContent.quotes.map((_, index) => (
            <button
              key={index}
              className={`quoteDot ${index === currentQuote ? 'active' : ''}`}
              onClick={() => setCurrentQuote(index)}
              aria-label={`Quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
