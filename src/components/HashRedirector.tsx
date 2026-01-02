'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirects old hash-based URLs to proper routes
 * e.g., #swamiji-ashram → /ashram
 */
const HASH_REDIRECTS: Record<string, string> = {
  '#swamiji-ashram': '/ashram',
  '#services': '/ashram',
  '#yantra': '/ashram',
  '#stotra': '/ashram',
  '#registration': '/login',
  '#donation': '/ashram',
  '#contact': '/ashram',
};

export function HashRedirector() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    if (hash && HASH_REDIRECTS[hash]) {
      const newPath = HASH_REDIRECTS[hash];
      // @ts-ignore - Dynamic routing with string
      router.push(newPath);
    }
  }, [router]);

  return null;
}
