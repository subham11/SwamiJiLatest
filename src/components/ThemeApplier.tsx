'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';

export function ThemeApplier() {
  const colors = useAppSelector((state) => state.theme.colors);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-tertiary', colors.tertiary);
    root.style.setProperty('--color-highlight', colors.highlight);
    
    // Create a more visible background gradient based on theme colors
    const bgGradient = `linear-gradient(135deg, 
      ${colors.primary}15 0%, 
      ${colors.secondary}12 25%, 
      ${colors.tertiary}15 50%, 
      ${colors.accent}12 75%, 
      ${colors.highlight}15 100%)`;
    
    root.style.setProperty('--theme-bg-gradient', bgGradient);
    
    // Apply background to body with a base color
    document.body.style.background = `linear-gradient(135deg, 
      ${colors.primary}20, 
      ${colors.tertiary}15, 
      ${colors.highlight}20)`;
    document.body.style.backgroundColor = '#FFF5E6';
    document.body.style.backgroundAttachment = 'fixed';
  }, [colors]);

  return null;
}
