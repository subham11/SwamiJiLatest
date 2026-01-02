'use client';

import { getAllPages } from '@/data/pages-components.seed';

type Props = {
  selectedPageId: string;
  onSelect: (pageId: string) => void;
};

export function PageList({ selectedPageId, onSelect }: Props) {
  const pages = getAllPages();

  return (
    <div>
      <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
        📄 Pages
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            style={{
              border: selectedPageId === page.id ? '2px solid var(--color-primary)' : '1px solid #e5e7eb',
              background: selectedPageId === page.id ? 'rgba(var(--color-primary-rgb), 0.05)' : '#fff',
              padding: '0.75rem',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: selectedPageId === page.id ? 'var(--color-primary)' : '#333',
              fontWeight: selectedPageId === page.id ? 600 : 500,
            }}
            onMouseEnter={e => {
              if (selectedPageId !== page.id) {
                (e.target as HTMLButtonElement).style.background = '#f9fafb';
              }
            }}
            onMouseLeave={e => {
              if (selectedPageId !== page.id) {
                (e.target as HTMLButtonElement).style.background = '#fff';
              }
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{page.name}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>{page.path}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
