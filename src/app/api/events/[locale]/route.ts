import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

function s3KeyForLocale(locale: string){
  const safe = SUPPORTED.has(locale) ? locale : 'en';
  const prefix = process.env.EVENTS_S3_PREFIX || 'content/';
  const normalized = prefix.endsWith('/') ? prefix : `${prefix}/`;
  return `${normalized}events.${safe}.json`;
}

function getS3(){
  const bucket = process.env.EVENTS_S3_BUCKET;
  if (!bucket) return null;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
  return { region, bucket } as const;
}

export async function GET(_req: NextRequest, context: { params: Promise<{ locale: string }> }){
  const { locale: _locale } = await context.params;
  const locale = _locale || 'en';
  try{
    const s3 = getS3();
    if (s3){
      try{
  // @ts-ignore optional dependency resolved at deploy time
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
        const Key = s3KeyForLocale(locale);
        const client = new S3Client({ region: s3.region });
        const out = await client.send(new GetObjectCommand({ Bucket: s3.bucket, Key }));
        const body = await out.Body?.transformToString?.('utf-8');
        const json = body ? JSON.parse(body) : { items: [] };
        return NextResponse.json(json, { status: 200, headers: { 'Cache-Control': 'no-store' } });
      }catch(err: any){
        // If not found, return empty list rather than 500
        return NextResponse.json({ items: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
      }
    }
    // Fallback to filesystem (local dev)
    const p = filePathForLocale(locale);
    const raw = await fs.readFile(p, 'utf-8');
    const json = JSON.parse(raw);
    return NextResponse.json(json, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }catch(err: any){
    return NextResponse.json({ error: 'Failed to read events file' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ locale: string }> }){
  const { locale: _locale } = await context.params;
  const locale = _locale || 'en';
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
    const content = JSON.stringify(data, null, 2);
    const s3 = getS3();
    if (s3){
  // @ts-ignore optional dependency resolved at deploy time
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const client = new S3Client({ region: s3.region });
      const Key = s3KeyForLocale(locale);
      await client.send(new PutObjectCommand({
        Bucket: s3.bucket,
        Key,
        Body: content,
        ContentType: 'application/json',
        CacheControl: 'no-cache',
      }));
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    // Fallback to filesystem (local dev)
    const p = filePathForLocale(locale);
    await fs.writeFile(p, content, 'utf-8');
    return NextResponse.json({ ok: true }, { status: 200 });
  }catch(err: any){
    return NextResponse.json({ error: 'Failed to write events file' }, { status: 500 });
  }
}
