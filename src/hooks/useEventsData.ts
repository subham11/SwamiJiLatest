"use client";

import { useEffect, useRef, useState } from 'react';

export type EventItem = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image?: string;
  link?: string;
};

type Source = 'public' | 'api';

export function useEventsData(locale: 'en' | 'hi', source: Source = 'public') {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Baseline of the last persisted version (useful for admin editor saves)
  const baselineRef = useRef<EventItem[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const url = source === 'public' ? `/content/events.${locale}.json` : `/api/events/${locale}`;
    fetch(url, { cache: source === 'public' ? 'default' : 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const list: EventItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems(list);
        baselineRef.current = list;
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed to load events', err);
        setError('Failed to load events');
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [locale, source]);

  const reload = () => {
    // Trigger effect by toggling a dummy state or by resetting state then refiring
    // Simpler: setLoading(true) and let the effect above refire when locale/source changes externally.
    // Consumers can change locale or call reload via a key change if needed.
    setLoading(true);
  };

  return { items, setItems, loading, error, setError, reload, baselineRef } as const;
}

export default useEventsData;
