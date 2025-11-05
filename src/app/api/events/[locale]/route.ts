import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUPPORTED = new Set(['en', 'hi']);

type EventItem = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image?: string;
  link?: string;
};

function filePathForLocale(locale: string){
  const safe = SUPPORTED.has(locale) ? locale : 'en';
  return path.join(process.cwd(), 'public', 'content', `events.${safe}.json`);
}

export async function GET(_req: Request, { params }: { params: { locale: string } }){
  const locale = params?.locale || 'en';
  try{
    const p = filePathForLocale(locale);
    const raw = await fs.readFile(p, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json, { status: 200 });
  }catch(err: any){
    return NextResponse.json({ error: 'Failed to read events file' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { locale: string } }){
  const locale = params?.locale || 'en';
  if (!SUPPORTED.has(locale)){
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  }
  try{
    const body = await req.json();
    // Expect shape { items: EventItem[] }
    if (!body || !Array.isArray(body.items)){
      return NextResponse.json({ error: 'Invalid payload: expected { items: [] }' }, { status: 400 });
    }
    // Basic normalize: coerce fields to strings
  const items: EventItem[] = body.items.map((it: any, idx: number) => ({
      id: it?.id ?? idx + 1,
      title: String(it?.title ?? ''),
      date: String(it?.date ?? ''),
      time: String(it?.time ?? ''),
      location: String(it?.location ?? ''),
      type: String(it?.type ?? ''),
      image: typeof it?.image === 'string' ? it.image : undefined,
      link: typeof it?.link === 'string' ? it.link : undefined,
    }));

    // Validate
    const errors: Array<{ index: number; field: string; message: string }> = [];
    const isValidUrl = (s: string) => {
      try {
        const u = new URL(s);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch {
        return false;
      }
    };
  items.forEach((it: EventItem, idx: number) => {
      if (!it.title?.trim()) errors.push({ index: idx, field: 'title', message: 'Required' });
      if (!it.date || isNaN(Date.parse(it.date))) errors.push({ index: idx, field: 'date', message: 'Invalid date' });
      if (!it.time?.trim()) errors.push({ index: idx, field: 'time', message: 'Required' });
      if (it.link && !isValidUrl(it.link)) errors.push({ index: idx, field: 'link', message: 'Invalid URL' });
      if (it.image && !isValidUrl(it.image)) errors.push({ index: idx, field: 'image', message: 'Invalid URL' });
    });
    if (errors.length) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const data = { items };
    const p = filePathForLocale(locale);
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(p, content, 'utf-8');
    return NextResponse.json({ ok: true }, { status: 200 });
  }catch(err: any){
    return NextResponse.json({ error: 'Failed to write events file' }, { status: 500 });
  }
}
