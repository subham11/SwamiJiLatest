'use client';

import { useRef } from 'react';
import type { DocumentItem } from '@/data/docs.seed';

type Props = {
  onAdd: (docs: DocumentItem[]) => void;
  monthKey: string; // YYYY-MM (for ids)
};

export function UploadPanel({ onAdd, monthKey }: Props){
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list: DocumentItem[] = Array.from(files).map((f, idx) => {
      const url = URL.createObjectURL(f);
      const type = /\.pdf$/i.test(f.name) ? 'pdf' : (/\.(png|jpe?g|gif|webp)$/i.test(f.name) ? 'image' : 'other');
      return {
        id: `${monthKey}-${Date.now()}-${idx}`,
        title: f.name,
        url,
        type,
      };
    });
    onAdd(list);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ border:'1px dashed var(--color-primary)', borderRadius:10, padding:'0.75rem', marginBottom:'1rem', background:'#fff' }}>
      <div style={{ fontWeight:600, marginBottom:'0.5rem' }}>Upload files</div>
      <input ref={inputRef} type="file" multiple onChange={(e)=>handleFiles(e.target.files)} />
      <div style={{ fontSize:12, opacity:0.7, marginTop:'0.25rem' }}>Supported: images, PDF. Files are kept in-session only (prototype).</div>
    </div>
  );
}
