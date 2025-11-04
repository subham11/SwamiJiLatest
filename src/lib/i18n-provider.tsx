'use client';
import React from 'react';
import "@/lib/i18n"; // initialize once

export function I18nProvider({ children }: { children: React.ReactNode }){
  return <>{children}</>;
}
