'use client';

import { DocumentItem } from '@/data/docs.seed';

type Props = {
  doc: DocumentItem | null;
  onClose: () => void;
};

export function DocumentViewer({ doc, onClose }: Props){
  if (!doc) return null;
  const isImage = doc.type === 'image' || /\.(png|jpe?g|gif|webp)$/i.test(doc.url);
  const isPdf = doc.type === 'pdf' || /\.pdf$/i.test(doc.url);
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 1000
    }}>
      <div style={{ background:'#fff', borderRadius:12, maxWidth:'90vw', maxHeight:'90vh', width:'min(900px, 90vw)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'0.5rem 0.75rem', borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontWeight:600 }}>{doc.title}</div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <a href={doc.url} download style={{ textDecoration:'none', color:'var(--color-primary)' }}>Download</a>
            <button onClick={onClose} style={{ border:'none', background:'transparent', fontWeight:700, cursor:'pointer' }}>✕</button>
          </div>
        </div>
        <div style={{ padding:'0.75rem', overflow:'auto', background:'#fafafa', flex:1 }}>
          {isImage && (
            <img src={doc.url} alt={doc.title} loading="lazy" decoding="async" style={{ maxWidth:'100%', height:'auto', display:'block', margin:'0 auto' }} />
          )}
          {isPdf && (
            <iframe src={`${doc.url}#view=FitH`} loading="lazy" style={{ width:'100%', height:'70vh', border:'none' }} />
          )}
          {!isImage && !isPdf && (
            <div>
              <p>Preview unavailable. You can download the file instead.</p>
              <a href={doc.url} download style={{ textDecoration:'none', color:'var(--color-primary)' }}>Download</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
