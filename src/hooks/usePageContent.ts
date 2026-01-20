import { useState, useEffect, useCallback, useRef } from 'react';

export interface ComponentContent {
  id: string;
  name: string;
  description?: string;
  content: Record<string, any>;
}

export interface PageLayout {
  pageId: string;
  locale: string;
  name: string;
  path: string;
  description?: string;
  components: ComponentContent[];
}

export interface PageSummary {
  pageId: string;
  name: string;
  path: string;
}

export function usePageContent(locale: 'en' | 'hi') {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch all pages for the locale
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/page-content/${locale}`);
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      setPages(data);
      // Check if using fallback data
      setUsingFallback(res.headers.get('X-Data-Source') === 'fallback');
    } catch (err) {
      setError('Failed to load pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Fetch a specific page with components
  const fetchPage = useCallback(async (pageId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/page-content/${locale}/${pageId}`);
      if (!res.ok) throw new Error('Failed to fetch page');
      const data = await res.json();
      setSelectedPage(data);
      // Check if using fallback data
      setUsingFallback(res.headers.get('X-Data-Source') === 'fallback');
    } catch (err) {
      setError('Failed to load page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Update a component's content
  const updateComponent = useCallback(async (
    pageId: string,
    componentId: string,
    content: Record<string, any>
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/page-content/${locale}/${pageId}/${componentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      // Refresh the page data
      await fetchPage(pageId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to save component');
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [locale, fetchPage]);

  // Initial fetch
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    pages,
    selectedPage,
    loading,
    error,
    saving,
    usingFallback,
    setError,
    fetchPages,
    fetchPage,
    updateComponent
  };
}
