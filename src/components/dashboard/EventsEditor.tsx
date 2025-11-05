"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

export type EventItem = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image?: string;
  link?: string;
};

const emptyEvent = (): EventItem => ({ id: Date.now(), title: '', date: '', time: '', location: '', type: '' });

export function EventsEditor(){
  const [locale, setLocale] = useState<'en'|'hi'>('en');
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<number, Partial<Record<'title'|'date'|'time'|'link'|'image', string>>>>({});
  const [dirty, setDirty] = useState<Set<number>>(new Set());
  const [justSaved, setJustSaved] = useState<Set<number>>(new Set());
  const baselineRef = useRef<EventItem[]>([]); // last persisted version

  useEffect(() => {
    setLoading(true);
    setError(null);
    setDirty(new Set());
    setJustSaved(new Set());
    fetch(`/api/events/${locale}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        setItems(items);
        baselineRef.current = items;
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load events');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [locale]);

  const addItem = () => setItems((prev) => {
    const next = [...prev, emptyEvent()];
    // Mark new index dirty so Save appears immediately
    setDirty((d) => new Set(d).add(next.length - 1));
    return next;
  });
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: Partial<EventItem>) => setItems((prev) => {
    const next = prev.map((it, i) => i === idx ? { ...it, ...patch } : it);
    setDirty((d) => {
      const nd = new Set(d);
      nd.add(idx);
      return nd;
    });
    // clear saved badge if modified again
    setJustSaved((s) => {
      const ns = new Set(s);
      ns.delete(idx);
      return ns;
    });
    return next;
  });

  // Drag and drop reorder
  const onDragStart = (idx: number) => setDragIndex(idx);
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (idx: number) => {
    setItems((prev) => {
      if (dragIndex === null || dragIndex === idx) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(idx, 0, moved);
      return copy;
    });
    setDragIndex(null);
  };

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateItem = (idx: number): boolean => {
    const it = items[idx];
    const fe: Partial<Record<'title'|'date'|'time'|'link'|'image', string>> = {};
    if (!it.title?.trim()) fe.title = 'Required';
    if (!it.date || isNaN(Date.parse(it.date))) fe.date = 'Invalid date';
    if (!it.time?.trim()) fe.time = 'Required';
    if (it.link && !isValidUrl(it.link)) fe.link = 'Invalid URL';
    if (it.image && !isValidUrl(it.image)) fe.image = 'Invalid URL';
    setFieldErrors((prev) => ({ ...prev, [idx]: fe }));
    return Object.keys(fe).length === 0;
  };

  const itemExistsInBaseline = (id: EventItem['id']) => baselineRef.current.some((b) => b.id === id);

  const saveItem = async (idx: number) => {
    setSavingIndex(idx);
    setError(null);
    try{
      if (!validateItem(idx)){
        throw new Error('validation');
      }
      const current = items[idx];
      // Build payload in current UI order: persist only this item's edits,
      // other items use last persisted versions; skip unsaved new drafts.
      const baselineMap = new Map< EventItem['id'], EventItem>(baselineRef.current.map(b => [b.id, b] as const));
      const payload: EventItem[] = [];
      items.forEach((it, i) => {
        if (i === idx) {
          payload.push(current);
        } else {
          const base = baselineMap.get(it.id);
          if (base) payload.push(base);
          // else skip brand-new drafts
        }
      });
      const res = await fetch(`/api/events/${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      // Update baseline to reflect the successful save
      baselineRef.current = payload;
      setDirty((d) => {
        const nd = new Set(d);
        nd.delete(idx);
        return nd;
      });
      setJustSaved((s) => new Set(s).add(idx));
      // Remove saved badge after a short delay
      setTimeout(() => {
        setJustSaved((s) => {
          const ns = new Set(s);
          ns.delete(idx);
          return ns;
        });
      }, 1200);
    }catch(err){
      console.error(err);
      setError('Failed to save this event. Please check fields.');
    }finally{
      setSavingIndex(null);
    }
  };

  // page-wide save removed in favor of per-card saveItem

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: '.75rem' }}>
        <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', margin: 0 }}>Upcoming Events (Admin)</h2>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
          <label htmlFor="locale">Locale:</label>
          <select id="locale" value={locale} onChange={(e)=> setLocale((e.target.value as 'en'|'hi'))}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          <button className="eventBtn" onClick={addItem} type="button">Add Event</button>
        </div>
      </div>

      {loading && <div className="sectionLoader"><div className="sectionSpinner" /><span>Loading...</span></div>}
      {error && <div style={{ color:'#b91c1c', marginBottom:'.5rem' }}>{error}</div>}
  {/* page-level saved removed; per-card saved indicator shown inline */}

      <div className="eventsGrid">
        {items.map((it, idx) => (
          <div
            key={it.id ?? idx}
            className="eventCard"
            onDragOver={onDragOver}
            onDrop={()=> onDrop(idx)}
            style={{ outline: dragIndex === idx ? '2px dashed var(--color-secondary)' : undefined }}
          >
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'.5rem' }}>
              <button
                type="button"
                title="Drag to reorder"
                draggable
                onDragStart={()=> onDragStart(idx)}
                style={{
                  cursor:'grab',
                  border:'1px solid #e5e7eb',
                  background:'#fafafa',
                  borderRadius:8,
                  padding:'0.25rem 0.5rem',
                  fontSize:'1rem'
                }}
              >
                ↕︎
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Title</label>
                <input value={it.title} onChange={(e)=> updateItem(idx, { title: e.target.value })} placeholder="Title" style={{ width:'100%', padding:'.5rem', borderColor: fieldErrors[idx]?.title ? '#b91c1c' : undefined }} />
                {fieldErrors[idx]?.title && <small style={{ color:'#b91c1c' }}>{fieldErrors[idx]?.title}</small>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Type</label>
                <input value={it.type} onChange={(e)=> updateItem(idx, { type: e.target.value })} placeholder="Type" style={{ width:'100%', padding:'.5rem' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Date</label>
                <input type="date" value={it.date} onChange={(e)=> updateItem(idx, { date: e.target.value })} style={{ width:'100%', padding:'.5rem', borderColor: fieldErrors[idx]?.date ? '#b91c1c' : undefined }} />
                {fieldErrors[idx]?.date && <small style={{ color:'#b91c1c' }}>{fieldErrors[idx]?.date}</small>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Time</label>
                <input value={it.time} onChange={(e)=> updateItem(idx, { time: e.target.value })} placeholder="e.g., 6:00 PM - 8:00 PM" style={{ width:'100%', padding:'.5rem', borderColor: fieldErrors[idx]?.time ? '#b91c1c' : undefined }} />
                {fieldErrors[idx]?.time && <small style={{ color:'#b91c1c' }}>{fieldErrors[idx]?.time}</small>}
              </div>
              <div style={{ gridColumn:'1 / span 2' }}>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Location</label>
                <input value={it.location} onChange={(e)=> updateItem(idx, { location: e.target.value })} placeholder="Location" style={{ width:'100%', padding:'.5rem' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Image URL</label>
                <input value={it.image || ''} onChange={(e)=> updateItem(idx, { image: e.target.value })} placeholder="https://..." style={{ width:'100%', padding:'.5rem', borderColor: fieldErrors[idx]?.image ? '#b91c1c' : undefined }} />
                {fieldErrors[idx]?.image && <small style={{ color:'#b91c1c' }}>{fieldErrors[idx]?.image}</small>}
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.8rem', color:'#555' }}>Link URL</label>
                <input value={it.link || ''} onChange={(e)=> updateItem(idx, { link: e.target.value })} placeholder="https://..." style={{ width:'100%', padding:'.5rem', borderColor: fieldErrors[idx]?.link ? '#b91c1c' : undefined }} />
                {fieldErrors[idx]?.link && <small style={{ color:'#b91c1c' }}>{fieldErrors[idx]?.link}</small>}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.75rem', gap:'.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                {(dirty.has(idx) || !itemExistsInBaseline(it.id)) && (
                  <button
                    className="eventBtn"
                    onClick={()=> saveItem(idx)}
                    type="button"
                    disabled={savingIndex === idx}
                    style={{ minWidth: 120 }}
                  >
                    {savingIndex === idx ? 'Saving...' : 'Save'}
                  </button>
                )}
                {justSaved.has(idx) && <span style={{ color:'#0f766e', fontWeight:700 }}>Saved!</span>}
              </div>
              <button className="eventBtn" style={{ background:'linear-gradient(135deg, #ef4444, #f59e0b)' }} onClick={()=> removeItem(idx)} type="button">Remove</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default EventsEditor;
