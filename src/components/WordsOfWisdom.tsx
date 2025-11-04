'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const quotes = [
  {
    en: "The mind is everything. What you think, you become.",
    hi: "मन ही सब कुछ है। जो आप सोचते हैं, वही आप बन जाते हैं।"
  },
  {
    en: "Peace comes from within. Do not seek it without.",
    hi: "शांति भीतर से आती है। इसे बाहर मत खोजो।"
  },
  {
    en: "Meditation brings wisdom; lack of meditation leaves ignorance.",
    hi: "ध्यान ज्ञान लाता है; ध्यान की कमी अज्ञानता छोड़ती है।"
  },
  {
    en: "Your purpose in life is to find your purpose and give your whole heart to it.",
    hi: "जीवन में आपका उद्देश्य अपने उद्देश्य को खोजना और अपना पूरा दिल देना है।"
  },
  {
    en: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    hi: "अतीत में मत रहो, भविष्य के सपने मत देखो, वर्तमान क्षण पर मन को केंद्रित करो।"
  }
];

export function WordsOfWisdom() {
  const { t, i18n } = useTranslation();
  const [currentQuote, setCurrentQuote] = useState(0);
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const goToPrev = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <section className="wordsOfWisdom">
      <div className="wisdomContainer">
        <div className="wisdomHeader">
          <h2 className="wisdomTitle">{t('cards.title')}</h2>
          <p className="wisdomSubtitle">{t('cards.subtitle')}</p>
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
              {quotes[currentQuote][locale]}
            </p>
            <div className="quoteAuthor">— {t('brand.name')}</div>
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
          {quotes.map((_, index) => (
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
