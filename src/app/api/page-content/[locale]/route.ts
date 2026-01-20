import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED = new Set(['en', 'hi']);

// Backend API URL - use environment variable or default to localhost for dev
function getBackendUrl() {
  return process.env.BACKEND_API_URL || 'http://localhost:3001';
}

// Fallback seed data when backend is not available
const FALLBACK_PAGES: Record<string, { pageId: string; name: string; path: string }[]> = {
  en: [
    { pageId: 'home', name: 'Home', path: '/' },
    { pageId: 'swamiji', name: 'About Swamiji', path: '/swamiji' },
    { pageId: 'bajrang-baan', name: 'Bajrang Baan', path: '/bajrang-baan' }
  ],
  hi: [
    { pageId: 'home', name: 'होम', path: '/' },
    { pageId: 'swamiji', name: 'स्वामीजी के बारे में', path: '/swamiji' },
    { pageId: 'bajrang-baan', name: 'बजरंग बाण', path: '/bajrang-baan' }
  ]
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale: _locale } = await context.params;
  const locale = SUPPORTED.has(_locale) ? _locale : 'en';

  try {
    const backendUrl = getBackendUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    const response = await fetch(`${backendUrl}/page-content/${locale}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Return fallback data
      return NextResponse.json(FALLBACK_PAGES[locale] || FALLBACK_PAGES.en, {
        status: 200,
        headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
      });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'api' }
    });
  } catch (err) {
    console.error('Failed to fetch page content, using fallback:', err);
    // Return fallback data when backend is not available
    return NextResponse.json(FALLBACK_PAGES[locale] || FALLBACK_PAGES.en, {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'X-Data-Source': 'fallback' }
    });
  }
}
