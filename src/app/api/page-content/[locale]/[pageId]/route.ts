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
            slide1: 'Divine Guidance For Modern Life',
            slide2: 'Daily Inspirations & Teachings',
            slides: [
              'Divine Guidance For Modern Life',
              'Daily Inspirations & Teachings',
              'Divine Guidance For Modern Life',
              'Daily Inspirations & Teachings',
              'Divine Guidance For Modern Life'
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
            subtitle: 'Timeless wisdom for modern living'
          }
        },
        {
          id: 'upcomingEvents',
          name: 'Upcoming Events',
          description: 'Shows upcoming events list',
          content: {
            title: 'Upcoming Events',
            subtitle: 'Join us for spiritual gatherings and community activities'
          }
        },
        {
          id: 'wordsOfWisdom',
          name: 'Words of Wisdom',
          description: 'Inspirational quotes section',
          content: {
            title: 'Words of Wisdom',
            subtitle: 'Daily Inspiration from Swami Ji'
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
            slide1: 'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
            slide2: 'दैनिक प्रेरणाएँ और उपदेश',
            slides: [
              'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
              'दैनिक प्रेरणाएँ और उपदेश',
              'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
              'दैनिक प्रेरणाएँ और उपदेश',
              'आधुनिक जीवन हेतु दिव्य मार्गदर्शन'
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
            subtitle: 'आधुनिक जीवन के लिए कालातीत ज्ञान'
          }
        },
        {
          id: 'upcomingEvents',
          name: 'आगामी कार्यक्रम',
          description: 'आगामी कार्यक्रमों की सूची',
          content: {
            title: 'आगामी कार्यक्रम',
            subtitle: 'आध्यात्मिक सभाओं और सामुदायिक गतिविधियों में हमसे जुड़ें'
          }
        },
        {
          id: 'wordsOfWisdom',
          name: 'ज्ञान के मोती',
          description: 'प्रेरणादायक उद्धरण अनुभाग',
          content: {
            title: 'ज्ञान के मोती',
            subtitle: 'स्वामी जी से दैनिक प्रेरणा'
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
