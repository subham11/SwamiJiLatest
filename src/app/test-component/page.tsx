import ScrollSnapAnimation from '@/components/ScrollSnapAnimation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Component - Scroll Animations',
  description: 'CSS scroll-driven scroll-snapping animations demonstration',
};

export default function TestComponentPage() {
  return <ScrollSnapAnimation />;
}
