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
