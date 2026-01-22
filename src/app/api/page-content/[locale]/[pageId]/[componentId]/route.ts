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

// Fallback component data
const FALLBACK_COMPONENTS: Record<string, Record<string, Record<string, any>>> = {
  en: {
    home: {
      announcementBar: {
        id: 'announcementBar',
        name: 'Announcement Bar',
        description: 'Top announcement banner with scrolling text',
        content: {
          text: '🔔 Join us for Hanuman Chalisa Path every Tuesday at 7 AM • 🎉 Special Bhandara on Nov 25th • 📿 New Yoga Sessions starting Nov 20th • 🙏 Daily Satsang at 6 PM',
          ariaLabel: 'Announcements'
        }
      },
      hero: {
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
      sacredTeachings: {
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
              fullContent: 'In the hustle of modern life, finding inner peace seems like a distant dream. Swami Ji teaches that peace is not something external to be found, but an internal state to be uncovered. Through daily meditation practice, mindful breathing, and conscious living, we can peel away the layers of stress and anxiety that cloud our natural state of serenity.',
              buttonText: 'Learn More',
              buttonLink: '/swamiji'
            },
            {
              id: 2,
              icon: '📿',
              title: 'Power of Mantras',
              description: 'Learn how sacred sounds and vibrations can transform your consciousness and connect you with the divine.',
              fullContent: 'Mantras are not mere words but powerful vibrations that resonate with the cosmic energy. The ancient rishis discovered that specific sound combinations could alter consciousness and create profound spiritual transformations.',
              buttonText: 'Learn More',
              buttonLink: '/bajrang-baan'
            },
            {
              id: 3,
              icon: '🙏🏻',
              title: 'Service to Humanity',
              description: 'Understand why selfless service (Seva) is considered the highest form of spiritual practice.',
              fullContent: 'Seva, or selfless service, is the cornerstone of spiritual growth. When we serve others without expectation of reward, we transcend the ego and connect with our higher self.',
              buttonText: 'Learn More',
              buttonLink: '/ashram'
            },
            {
              id: 4,
              icon: '🙏🏼',
              title: 'Living with Purpose',
              description: 'Find your dharma and learn to align your daily actions with your higher spiritual purpose.',
              fullContent: 'Every soul is born with a unique purpose, a dharma that only they can fulfill. The challenge lies in discovering this purpose and having the courage to pursue it.',
              buttonText: 'Learn More',
              buttonLink: '/swamiji'
            }
          ]
        }
      },
      wordsOfWisdom: {
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
      },
      upcomingEvents: {
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
      }
    },
    'bajrang-baan': {
      'bajrang-hero': {
        id: 'bajrang-hero',
        name: 'Hero Section',
        description: 'Hero slides with images, titles, and descriptions',
        content: {
          slides: [
            { id: 1, title: 'Shri Bajrang Baan Campaign', description: 'Achieve success and strength in life with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/b2l.png' },
            { id: 2, title: 'Spiritual Power', description: 'Recitation of Bajrang Baan provides extraordinary strength and protection', imageUrl: '/images/Bajrang_Baan/c2l.png' },
            { id: 3, title: 'Daily Sadhana', description: 'Regular recitation brings positive energy to life', imageUrl: '/images/Bajrang_Baan/d2l.png' },
            { id: 4, title: 'Sankat Mochan', description: 'All obstacles are removed with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/e2l.png' },
            { id: 5, title: 'Divine Blessings', description: 'Receive divine blessings through devotion and faith', imageUrl: '/images/Bajrang_Baan/f2l.png' }
          ]
        }
      },
      'bajrang-content': {
        id: 'bajrang-content',
        name: 'Page Content',
        description: 'Main content section with title and paragraphs',
        content: {
          title: '|| Shri Bajrang Baan Divine Weapon Practice - Under the Guidance of Param Pujya Shri Rupeshwaranand Ji ||',
          paragraph1: 'Those devotees who wish to resolve their divine problems with the grace of Lord Hanuman, who want purification of their homes, who feel afflicted by obstacles such as evil spirits, should recite Shri Baan at least 11 times daily!',
          paragraph2: 'A collective campaign has been initiated under the leadership of Swami Rupeshwaranand Ji Maharaj in the form of "Shri Bajrang Baan Divine Weapon Practice" to recite 108 times every Sunday at 5 AM, whose main objective is national welfare, upliftment of Sanatan culture, and public welfare!',
          paragraph3: 'By participating in this campaign and reciting Shri Bajrang Baan, many devotees have received divine benefits and their divine problems have been resolved! Spiritual progress has also been experienced! The main goal through this collective campaign is to purify the divine atmosphere of India.',
          paragraph4: 'Special practitioners should master Shri Ram Raksha Stotra! This will provide them complete divine protection!',
          paragraph5: 'Before the 108 recitations of Bajrang Baan, must perform Shatkarma and Sankalpa...must read the protective shield!'
        }
      }
    }
  },
  hi: {
    home: {
      announcementBar: {
        id: 'announcementBar',
        name: 'घोषणा पट्टी',
        description: 'शीर्ष पर स्क्रॉल होने वाली घोषणा',
        content: {
          text: '🔔 प्रत्येक मंगलवार सुबह 7 बजे हनुमान चालीसा पाठ में शामिल हों • 🎉 25 नवंबर को विशेष भंडारा • 📿 20 नवंबर से नए योग सत्र शुरू • 🙏 शाम 6 बजे दैनिक सत्संग',
          ariaLabel: 'घोषणा'
        }
      },
      hero: {
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
      sacredTeachings: {
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
              fullContent: 'आधुनिक जीवन की भागदौड़ में, आंतरिक शांति पाना एक दूर का सपना लगता है। स्वामी जी सिखाते हैं कि शांति कोई बाहरी वस्तु नहीं है जो खोजी जाए, बल्कि यह एक आंतरिक अवस्था है।',
              buttonText: 'और जानें',
              buttonLink: '/swamiji'
            },
            {
              id: 2,
              icon: '📿',
              title: 'मंत्रों की शक्ति',
              description: 'जानें कैसे पवित्र ध्वनियां और कंपन आपकी चेतना को रूपांतरित कर सकते हैं और आपको दिव्यता से जोड़ सकते हैं।',
              fullContent: 'मंत्र केवल शब्द नहीं बल्कि शक्तिशाली कंपन हैं जो ब्रह्मांडीय ऊर्जा के साथ गूंजते हैं। प्राचीन ऋषियों ने खोजा कि विशिष्ट ध्वनि संयोजन चेतना को बदल सकते हैं।',
              buttonText: 'और जानें',
              buttonLink: '/bajrang-baan'
            },
            {
              id: 3,
              icon: '🙏🏻',
              title: 'मानवता की सेवा',
              description: 'समझें कि निस्वार्थ सेवा (सेवा) को आध्यात्मिक अभ्यास का सर्वोच्च रूप क्यों माना जाता है।',
              fullContent: 'सेवा आध्यात्मिक विकास की आधारशिला है। जब हम बिना किसी प्रतिफल की अपेक्षा के दूसरों की सेवा करते हैं, तो हम अहंकार से परे जाते हैं।',
              buttonText: 'और जानें',
              buttonLink: '/ashram'
            },
            {
              id: 4,
              icon: '🙏🏼',
              title: 'उद्देश्य के साथ जीवन',
              description: 'अपना धर्म खोजें और अपने दैनिक कार्यों को अपने उच्चतर आध्यात्मिक उद्देश्य के साथ संरेखित करना सीखें।',
              fullContent: 'हर आत्मा एक अद्वितीय उद्देश्य के साथ जन्म लेती है, एक धर्म जो केवल वे ही पूरा कर सकते हैं। चुनौती इस उद्देश्य को खोजने में है।',
              buttonText: 'और जानें',
              buttonLink: '/swamiji'
            }
          ]
        }
      },
      wordsOfWisdom: {
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
      },
      upcomingEvents: {
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
      }
    },
    'bajrang-baan': {
      'bajrang-hero': {
        id: 'bajrang-hero',
        name: 'हीरो सेक्शन',
        description: 'छवियों, शीर्षकों और विवरणों के साथ हीरो स्लाइड',
        content: {
          slides: [
            { id: 1, title: 'श्री बजरंग बाण अभियान', description: 'श्री हनुमान जी की कृपा से जीवन में सफलता और शक्ति प्राप्त करें', imageUrl: '/images/Bajrang_Baan/b2l.png' },
            { id: 2, title: 'आध्यात्मिक शक्ति', description: 'बजरंग बाण के पाठ से मिलती है अद्भुत शक्ति और सुरक्षा', imageUrl: '/images/Bajrang_Baan/c2l.png' },
            { id: 3, title: 'दैनिक साधना', description: 'नियमित पाठ से जीवन में आती है सकारात्मक ऊर्जा', imageUrl: '/images/Bajrang_Baan/d2l.png' },
            { id: 4, title: 'संकट मोचन', description: 'हनुमान जी की कृपा से दूर होते हैं सभी संकट', imageUrl: '/images/Bajrang_Baan/e2l.png' },
            { id: 5, title: 'आशीर्वाद', description: 'भक्ति और श्रद्धा से प्राप्त करें दिव्य आशीर्वाद', imageUrl: '/images/Bajrang_Baan/f2l.png' }
          ]
        }
      },
      'bajrang-content': {
        id: 'bajrang-content',
        name: 'पृष्ठ सामग्री',
        description: 'शीर्षक और पैराग्राफ के साथ मुख्य सामग्री अनुभाग',
        content: {
          title: '|| श्री बजरंग बाण दिव्यास्त्र प्रयोग - परम पूज्य श्री रुपेश्वरानंद जी के मार्गदर्शन में ||',
          paragraph1: 'जो श्रध्दालु, हनुमान जी के भक्त गण श्री हनुमान जी कृपा से अपनी दैवीय समस्याओं का समाधान चाहते है, घर का शुध्दिकरण चाहते है, जो प्रेत आदि बाधाओं से स्वयं को ग्रसित समझते है, वे नित्य श्री बाण का कम से कम 11 पाठ करें!',
          paragraph2: '"श्री बजरंग बाण दिव्यास्त्र प्रयोग" के रूप में प्रत्येक रविवार को प्रातः 5 बजे 108 पाठ करने का एक सामूहिक अभियान स्वामी रुपेश्वरानंद जी महाराज के नेतृत्त्व में आरम्भ किया गया है, जिसका मुख्य उद्देश्य राष्ट्र कल्याण, सनातन संस्कृति का उत्थान एवं जन कल्याण है!',
          paragraph3: 'इस अभियान में भाग लेते हुए श्री बजरंग बाण का पाठ करने से अनेक श्रध्दालुओं को दैवीय लाभ हुए है तथा उनकी दैवीय समस्याओं का समाधान हुआ है! साथ ही आध्यात्मिक उन्नति के अनुभव भी हुए है! इस सामूहिक अभियान के माध्यम से भारतवर्ष के दैवीय वातावरण में शुध्दिकरण करना मुख्य लक्ष्य है।',
          paragraph4: 'विशेष साधक श्री राम रक्षा स्तोत्र सिद्ध कर लें! इससे उन्हें पूर्ण दैवीय सुरक्षा प्राप्त होगी!',
          paragraph5: 'बजरंग बाण 108 पाठ के पूर्व षट्कर्म और संकल्प अवश्य करें...रक्षा कवच अवश्य पढ़ लें!'
        }
      }
    }
  }
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ locale: string; pageId: string; componentId: string }> }
) {
  const { locale: _locale, pageId, componentId } = await context.params;
  const locale = SUPPORTED.has(_locale) ? _locale : 'en';

  try {
    const backendUrl = getBackendUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(
      `${backendUrl}/page-content/${locale}/${pageId}/${componentId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try fallback
      const fallback = FALLBACK_COMPONENTS[locale]?.[pageId]?.[componentId];
      if (fallback) {
        return NextResponse.json(fallback, {
          status: 200,
          headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
        });
      }
      return NextResponse.json(
        { error: `Component '${componentId}' not found` },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'api' }
    });
  } catch (err) {
    console.error('Failed to fetch component, using fallback:', err);
    // Return fallback when backend is not available
    const fallback = FALLBACK_COMPONENTS[locale]?.[pageId]?.[componentId];
    if (fallback) {
      return NextResponse.json(fallback, {
        status: 200,
        headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ locale: string; pageId: string; componentId: string }> }
) {
  const { locale: _locale, pageId, componentId } = await context.params;
  const locale = SUPPORTED.has(_locale) ? _locale : 'en';

  try {
    const token = await getAuthToken();
    const body = await req.json();
    const backendUrl = getBackendUrl();

    const response = await fetch(
      `${backendUrl}/page-content/${locale}/${pageId}/${componentId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update component' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Failed to update component:', err);
    return NextResponse.json(
      { error: 'Backend server is not available. Please start the backend server to save changes.' },
      { status: 503 }
    );
  }
}
