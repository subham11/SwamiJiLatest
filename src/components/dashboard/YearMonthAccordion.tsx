'use client';

import { useState } from 'react';

type Props = {
  years: Array<{ year: string; months: string[] }>;
  selected?: string; // YYYY-MM
  onSelect: (key: string) => void;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function YearMonthAccordion({ years, selected, onSelect }: Props){
  const [openYear, setOpenYear] = useState<string | null>(years[0]?.year ?? null);

  return (
    <aside style={{ borderLeft: '1px solid #e5e7eb', padding:'1rem', width: '100%' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>Archive</h3>
      <div>
        {years.map(({ year, months }) => {
          const isOpen = openYear === year;
          return (
            <div key={year} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setOpenYear(isOpen ? null : year)}
                style={{
                  width:'100%', textAlign:'left', padding:'0.5rem 0.25rem', fontWeight:600,
                  background:'transparent', border:'none', cursor:'pointer'
                }}
              >
                {year} {isOpen ? '▾' : '▸'}
              </button>
              <div style={{
                maxHeight: isOpen ? months.length * 40 + 'px' : '0px',
                overflow:'hidden', transition:'max-height 300ms ease',
              }}>
                {months.map((m) => {
                  const key = `${year}-${m}`;
                  const monthIdx = Math.min(11, Math.max(0, Number(m) - 1));
                  const label = `${MONTHS[monthIdx]} ${year}`;
                  const isSel = selected === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => onSelect(key)}
                        style={{
                          width:'100%', textAlign:'left', padding:'0.4rem 0.5rem',
                          background: isSel ? 'var(--color-primary)' : 'transparent',
                          color: isSel ? '#fff' : 'inherit', border:'none', cursor:'pointer', borderRadius:6,
                        }}
                      >
                        {label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
