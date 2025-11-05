"use client";

import { useState } from 'react';
import type { EventItem } from './useEventsData';

type FieldKey = 'title' | 'date' | 'time' | 'link' | 'image';

export function useEventValidation() {
  const [fieldErrors, setFieldErrors] = useState<Record<number, Partial<Record<FieldKey, string>>>>({});

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateItem = (idx: number, items: EventItem[]): boolean => {
    const it = items[idx];
    const fe: Partial<Record<FieldKey, string>> = {};
    if (!it.title?.trim()) fe.title = 'Required';
    if (!it.date || isNaN(Date.parse(it.date))) fe.date = 'Invalid date';
    if (!it.time?.trim()) fe.time = 'Required';
    if (it.link && !isValidUrl(it.link)) fe.link = 'Invalid URL';
    if (it.image && !isValidUrl(it.image)) fe.image = 'Invalid URL';
    setFieldErrors((prev) => ({ ...prev, [idx]: fe }));
    return Object.keys(fe).length === 0;
  };

  return { fieldErrors, setFieldErrors, validateItem, isValidUrl } as const;
}

export default useEventValidation;
