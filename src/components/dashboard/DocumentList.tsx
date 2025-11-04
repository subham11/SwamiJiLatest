'use client';

import { DocumentItem } from '@/data/docs.seed';

type Props = {
  items: DocumentItem[];
  onOpen: (doc: DocumentItem) => void;
};

export function DocumentList({ items, onOpen }: Props){
  if (!items?.length) return <div style={{ opacity: 0.7 }}>No documents for this month.</div>;
  return (
    <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gap:'0.5rem' }}>
      {items.map(doc => (
        <li key={doc.id} style={{
          border:'1px solid #e5e7eb', borderRadius:8, padding:'0.5rem 0.75rem', display:'flex', alignItems:'center', justifyContent:'space-between'
        }}>
          <div>
            <div style={{ fontWeight:600 }}>{doc.title}</div>
            <div style={{ fontSize:12, opacity:0.7 }}>{doc.type.toUpperCase()}</div>
          </div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <a href={doc.url} download style={{ textDecoration:'none', color:'var(--color-primary)' }}>Download</a>
            <button onClick={() => onOpen(doc)} style={{ border:'1px solid var(--color-primary)', color:'var(--color-primary)', background:'transparent', padding:'0.35rem 0.6rem', borderRadius:6 }}>View</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
