"use client";

import dynamic from 'next/dynamic';

export const SacredTeachings = dynamic(
  () => import('@/components/SacredTeachings').then(m => m.SacredTeachings),
  { ssr: false }
);

export const WordsOfWisdom = dynamic(
  () => import('@/components/WordsOfWisdom').then(m => m.WordsOfWisdom),
  { ssr: false }
);

export const UpcomingEvents = dynamic(
  () => import('@/components/UpcomingEvents').then(m => m.UpcomingEvents),
  { ssr: false }
);
