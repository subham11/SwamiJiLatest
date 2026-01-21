import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED = new Set(['en', 'hi']);

function getBackendUrl() {
  return process.env.BACKEND_API_URL || 'http://localhost:3001';
}

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || '';
}

// Fallback page data when backend is not available
const FALLBACK_PAGE_DATA: Record<string, Record<string, any>> = {
  en: {
    home: {
      pageId: 'home',
      locale: 'en',
      name: 'Home',
      path: '/',
      description: 'Main landing page',
      components: [
        {
          id: 'announcementBar',
          name: 'Announcement Bar',
          description: 'Top announcement banner with scrolling text',
          content: {
            text: '🔔 Join us for Hanuman Chalisa Path every Tuesday at 7 AM • 🎉 Special Bhandara on Nov 25th • 📿 New Yoga Sessions starting Nov 20th • 🙏 Daily Satsang at 6 PM',
            ariaLabel: 'Announcements'
          }
        },
        {
          id: 'hero',
          name: 'Hero Section',
          description: 'Main hero banner with parallax effect',
          content: {
            slides: [
              'Divine Guidance For Modern Life',
              'Daily Inspirations & Teachings',
              'Path to Inner Peace',
              'Ancient Wisdom for Today',
              'Spiritual Awakening Awaits'
            ],
            cta: 'Explore Now'
          }
        },
        {
          id: 'sacredTeachings',
          name: 'Sacred Teachings',
          description: 'Display sacred teachings section',
          content: {
            title: 'Sacred Teachings',
            subtitle: 'Timeless wisdom for modern living',
            cards: [
              {
                id: 1,
                icon: '🙏',
                title: 'Path to Inner Peace',
                description: 'Discover ancient techniques for finding tranquility in the modern world through meditation and mindful living.',
                fullContent: 'In the hustle of modern life, finding inner peace seems like a distant dream. Swami Ji teaches that peace is not something external to be found, but an internal state to be uncovered. Through daily meditation practice, mindful breathing, and conscious living, we can peel away the layers of stress and anxiety that cloud our natural state of serenity. The path begins with simple practices: sitting quietly for just 10 minutes each morning, focusing on the breath, and gradually expanding our awareness to encompass all aspects of life.',
                buttonText: 'Learn More',
                buttonLink: '/swamiji'
              },
              {
                id: 2,
                icon: '📿',
                title: 'Power of Mantras',
                description: 'Learn how sacred sounds and vibrations can transform your consciousness and connect you with the divine.',
                fullContent: 'Mantras are not mere words but powerful vibrations that resonate with the cosmic energy. The ancient rishis discovered that specific sound combinations could alter consciousness and create profound spiritual transformations. Whether it is the simple "Om" or the powerful Hanuman Chalisa, each mantra carries its unique frequency. Regular chanting purifies the mind, strengthens concentration, and creates a protective spiritual shield around the practitioner.',
                buttonText: 'Learn More',
                buttonLink: '/bajrang-baan'
              },
              {
                id: 3,
                icon: '🙏🏻',
                title: 'Service to Humanity',
                description: 'Understand why selfless service (Seva) is considered the highest form of spiritual practice.',
                fullContent: 'Seva, or selfless service, is the cornerstone of spiritual growth. When we serve others without expectation of reward, we transcend the ego and connect with our higher self. Swami Ji emphasizes that true spirituality is not found in isolation but in active engagement with the world. Whether feeding the hungry, caring for the sick, or simply offering a kind word to someone in need, each act of service is a prayer in action.',
                buttonText: 'Learn More',
                buttonLink: '/ashram'
              },
              {
                id: 4,
                icon: '🙏🏼',
                title: 'Living with Purpose',
                description: 'Find your dharma and learn to align your daily actions with your higher spiritual purpose.',
                fullContent: 'Every soul is born with a unique purpose, a dharma that only they can fulfill. The challenge lies in discovering this purpose and having the courage to pursue it. Swami Ji guides devotees to look within, to listen to the whispers of the soul, and to align their actions with their highest calling. When we live in accordance with our dharma, life flows effortlessly, obstacles become stepping stones, and every moment becomes an offering to the divine.',
                buttonText: 'Learn More',
                buttonLink: '/swamiji'
              }
            ]
          }
        },
        {
          id: 'upcomingEvents',
          name: 'Upcoming Events',
          description: 'Shows upcoming events list',
          content: {
            title: 'Upcoming Events',
            subtitle: 'Join us for spiritual gatherings and community activities',
            events: [
              { id: 1, title: 'Community Bhandara', date: '2025-11-25', time: '12:00 PM - 2:00 PM', location: 'Ashram Grounds', type: 'Community Service', image: '', link: '' },
              { id: 2, title: 'Hanuman Chalisa Path', date: '2025-11-08', time: '7:00 AM - 8:00 AM', location: 'Temple Premises', type: 'Daily Prayer', image: '', link: '' },
              { id: 3, title: 'Yoga & Pranayama Session', date: '2025-11-20', time: '5:30 AM - 7:00 AM', location: 'Yoga Hall', type: 'Health & Wellness', image: '', link: '' },
              { id: 4, title: 'Spiritual Discourse & Meditation', date: '2025-11-15', time: '6:00 PM - 8:00 PM', location: 'Main Ashram Hall', type: 'Weekly Satsang', image: '', link: '' }
            ]
          }
        },
        {
          id: 'wordsOfWisdom',
          name: 'Words of Wisdom',
          description: 'Inspirational quotes section',
          content: {
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
          }
        }
      ]
    },
    swamiji: {
      pageId: 'swamiji',
      locale: 'en',
      name: 'About Swamiji',
      path: '/swamiji',
      description: 'Swamiji biography and teachings',
      components: [
        {
          id: 'swamiji-hero',
          name: 'Hero Section',
          description: 'Swamiji introduction',
          content: {
            title: 'Swamiji',
            subtitle: 'A life of devotion and wisdom'
          }
        }
      ]
    },
    'bajrang-baan': {
      pageId: 'bajrang-baan',
      locale: 'en',
      name: 'Bajrang Baan',
      path: '/bajrang-baan',
      description: 'Sacred chanting and mantras page',
      components: [
        {
          id: 'bajrang-hero',
          name: 'Hero Section',
          description: 'Page introduction',
          content: {
            title: 'Bajrang Baan Abhiyan',
            subtitle: 'Collective chanting for divine connection'
          }
        }
      ]
    }
  },
  hi: {
    home: {
      pageId: 'home',
      locale: 'hi',
      name: 'होम',
      path: '/',
      description: 'मुख्य पृष्ठ',
      components: [
        {
          id: 'announcementBar',
          name: 'घोषणा पट्टी',
          description: 'शीर्ष पर स्क्रॉल होने वाली घोषणा',
          content: {
            text: '🔔 प्रत्येक मंगलवार सुबह 7 बजे हनुमान चालीसा पाठ में शामिल हों • 🎉 25 नवंबर को विशेष भंडारा • 📿 20 नवंबर से नए योग सत्र शुरू • 🙏 शाम 6 बजे दैनिक सत्संग',
            ariaLabel: 'घोषणा'
          }
        },
        {
          id: 'hero',
          name: 'हीरो सेक्शन',
          description: 'मुख्य बैनर',
          content: {
            slides: [
              'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
              'दैनिक प्रेरणाएँ और उपदेश',
              'आंतरिक शांति का मार्ग',
              'आज के लिए प्राचीन ज्ञान',
              'आध्यात्मिक जागृति आपका इंतज़ार कर रही है'
            ],
            cta: 'अभी देखें'
          }
        },
        {
          id: 'sacredTeachings',
          name: 'पवित्र शिक्षाएं',
          description: 'पवित्र शिक्षाओं का अनुभाग',
          content: {
            title: 'पवित्र शिक्षाएं',
            subtitle: 'आधुनिक जीवन के लिए कालातीत ज्ञान',
            cards: [
              {
                id: 1,
                icon: '🙏',
                title: 'आंतरिक शांति का मार्ग',
                description: 'ध्यान और सचेत जीवन के माध्यम से आधुनिक दुनिया में शांति पाने की प्राचीन तकनीकें सीखें।',
                fullContent: 'आधुनिक जीवन की भागदौड़ में, आंतरिक शांति पाना एक दूर का सपना लगता है। स्वामी जी सिखाते हैं कि शांति कोई बाहरी वस्तु नहीं है जो खोजी जाए, बल्कि यह एक आंतरिक अवस्था है जो उजागर होनी चाहिए। दैनिक ध्यान अभ्यास, सचेत श्वास, और जागरूक जीवन के माध्यम से, हम तनाव और चिंता की परतों को हटा सकते हैं। यह मार्ग सरल अभ्यासों से शुरू होता है: प्रत्येक सुबह केवल 10 मिनट शांत बैठकर, श्वास पर ध्यान केंद्रित करके।',
                buttonText: 'और जानें',
                buttonLink: '/swamiji'
              },
              {
                id: 2,
                icon: '📿',
                title: 'मंत्रों की शक्ति',
                description: 'जानें कैसे पवित्र ध्वनियां और कंपन आपकी चेतना को रूपांतरित कर सकते हैं और आपको दिव्यता से जोड़ सकते हैं।',
                fullContent: 'मंत्र केवल शब्द नहीं बल्कि शक्तिशाली कंपन हैं जो ब्रह्मांडीय ऊर्जा के साथ गूंजते हैं। प्राचीन ऋषियों ने खोजा कि विशिष्ट ध्वनि संयोजन चेतना को बदल सकते हैं और गहन आध्यात्मिक परिवर्तन ला सकते हैं। चाहे वह सरल "ॐ" हो या शक्तिशाली हनुमान चालीसा, प्रत्येक मंत्र की अपनी विशिष्ट आवृत्ति होती है। नियमित जप मन को शुद्ध करता है, एकाग्रता को मजबूत करता है।',
                buttonText: 'और जानें',
                buttonLink: '/bajrang-baan'
              },
              {
                id: 3,
                icon: '🙏🏻',
                title: 'मानवता की सेवा',
                description: 'समझें कि निस्वार्थ सेवा (सेवा) को आध्यात्मिक अभ्यास का सर्वोच्च रूप क्यों माना जाता है।',
                fullContent: 'सेवा आध्यात्मिक विकास की आधारशिला है। जब हम बिना किसी प्रतिफल की अपेक्षा के दूसरों की सेवा करते हैं, तो हम अहंकार से परे जाते हैं और अपने उच्चतर स्व से जुड़ते हैं। स्वामी जी जोर देते हैं कि सच्ची आध्यात्मिकता अकेलेपन में नहीं बल्कि दुनिया के साथ सक्रिय जुड़ाव में पाई जाती है। चाहे भूखों को खाना खिलाना हो, बीमारों की देखभाल करना हो, या किसी जरूरतमंद को दयालु शब्द कहना हो।',
                buttonText: 'और जानें',
                buttonLink: '/ashram'
              },
              {
                id: 4,
                icon: '🙏🏼',
                title: 'उद्देश्य के साथ जीवन',
                description: 'अपना धर्म खोजें और अपने दैनिक कार्यों को अपने उच्चतर आध्यात्मिक उद्देश्य के साथ संरेखित करना सीखें।',
                fullContent: 'हर आत्मा एक अद्वितीय उद्देश्य के साथ जन्म लेती है, एक धर्म जो केवल वे ही पूरा कर सकते हैं। चुनौती इस उद्देश्य को खोजने और इसे अपनाने का साहस रखने में है। स्वामी जी भक्तों का मार्गदर्शन करते हैं कि वे अंदर देखें, आत्मा की फुसफुसाहट सुनें, और अपने कार्यों को अपनी सर्वोच्च पुकार के साथ संरेखित करें। जब हम अपने धर्म के अनुसार जीते हैं, तो जीवन सहज रूप से बहता है।',
                buttonText: 'और जानें',
                buttonLink: '/swamiji'
              }
            ]
          }
        },
        {
          id: 'upcomingEvents',
          name: 'आगामी कार्यक्रम',
          description: 'आगामी कार्यक्रमों की सूची',
          content: {
            title: 'आगामी कार्यक्रम',
            subtitle: 'आध्यात्मिक सभाओं और सामुदायिक गतिविधियों में हमसे जुड़ें',
            events: [
              { id: 1, title: 'सामुदायिक भंडारा', date: '2025-11-25', time: 'दोपहर 12:00 - 2:00 बजे', location: 'आश्रम मैदान', type: 'सामुदायिक सेवा', image: '', link: '' },
              { id: 2, title: 'हनुमान चालीसा पाठ', date: '2025-11-08', time: 'सुबह 7:00 - 8:00 बजे', location: 'मंदिर परिसर', type: 'दैनिक प्रार्थना', image: '', link: '' },
              { id: 3, title: 'योग एवं प्राणायाम सत्र', date: '2025-11-20', time: 'सुबह 5:30 - 7:00 बजे', location: 'योग हॉल', type: 'स्वास्थ्य एवं कल्याण', image: '', link: '' },
              { id: 4, title: 'आध्यात्मिक प्रवचन एवं ध्यान', date: '2025-11-15', time: 'शाम 6:00 - 8:00 बजे', location: 'मुख्य आश्रम हॉल', type: 'साप्ताहिक सत्संग', image: '', link: '' }
            ]
          }
        },
        {
          id: 'wordsOfWisdom',
          name: 'ज्ञान के मोती',
          description: 'प्रेरणादायक उद्धरण अनुभाग',
          content: {
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
        }
      ]
    },
    swamiji: {
      pageId: 'swamiji',
      locale: 'hi',
      name: 'स्वामीजी के बारे में',
      path: '/swamiji',
      description: 'स्वामीजी की जीवनी और शिक्षाएं',
      components: [
        {
          id: 'swamiji-hero',
          name: 'हीरो सेक्शन',
          description: 'स्वामीजी का परिचय',
          content: {
            title: 'स्वामीजी',
            subtitle: 'भक्ति और ज्ञान का जीवन'
          }
        }
      ]
    },
    'bajrang-baan': {
      pageId: 'bajrang-baan',
      locale: 'hi',
      name: 'बजरंग बाण',
      path: '/bajrang-baan',
      description: 'पवित्र पाठ और मंत्र पृष्ठ',
      components: [
        {
          id: 'bajrang-hero',
          name: 'हीरो सेक्शन',
          description: 'पृष्ठ परिचय',
          content: {
            title: 'श्री बजरंग बाण अभियान',
            subtitle: 'दिव्य संबंध के लिए सामूहिक पाठ'
          }
        }
      ]
    }
  }
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ locale: string; pageId: string }> }
) {
  const { locale: _locale, pageId } = await context.params;
  const locale = SUPPORTED.has(_locale) ? _locale : 'en';

  try {
    const backendUrl = getBackendUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    const response = await fetch(`${backendUrl}/page-content/${locale}/${pageId}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try fallback data
      const fallbackPage = FALLBACK_PAGE_DATA[locale]?.[pageId];
      if (fallbackPage) {
        return NextResponse.json(fallbackPage, {
          status: 200,
          headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
        });
      }
      return NextResponse.json(
        { error: `Page '${pageId}' not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'api' }
    });
  } catch (err) {
    console.error('Failed to fetch page content, using fallback:', err);
    // Return fallback data when backend is not available
    const fallbackPage = FALLBACK_PAGE_DATA[locale]?.[pageId];
    if (fallbackPage) {
      return NextResponse.json(fallbackPage, {
        status: 200,
        headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ locale: string; pageId: string }> }
) {
  const { locale: _locale, pageId } = await context.params;
  const locale = SUPPORTED.has(_locale) ? _locale : 'en';

  try {
    const token = await getAuthToken();
    const body = await req.json();
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/page-content/${locale}/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update page' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Failed to update page content:', err);
    return NextResponse.json(
      { error: 'Backend server is not available. Please start the backend server to save changes.' },
      { status: 503 }
    );
  }
}
