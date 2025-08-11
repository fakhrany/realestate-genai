// lib/rag.ts
import { prisma } from './db';

export type Parsed = {
  locale: 'en' | 'ar';
  priceMax?: number;
  bedrooms?: number;
  deliveryYear?: number;
  city?: string;
  district?: string;
  textForEmbedding: string;
};

export type RagAnswer = {
  title: string;
  text: string;
  sources: { id: number; title: string }[];
};

export type RagPin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: string;
  meta: string;
};

export type RagResult = {
  answer: RagAnswer;
  pins: RagPin[];
};

const ARABIC_DIGIT_MAP: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

function normalizeDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (d) => ARABIC_DIGIT_MAP[d] ?? d);
}

function toNumberLike(raw: string): number | undefined {
  if (!raw) return undefined;
  const s = normalizeDigits(raw).trim().toLowerCase();
  // remove currency words/spaces/commas
  const base = s.replace(/(egp|جنيه|جنيه مصري|usd|\s|,)/g, '');
  // k / m in English; "مليون" in Arabic
  if (base.endsWith('k')) return parseFloat(base.replace('k', '')) * 1_000;
  if (base.endsWith('m')) return parseFloat(base.replace('m', '')) * 1_000_000;
  if (base.endsWith('مليون')) return parseFloat(base.replace('مليون', '')) * 1_000_000;
  const n = parseFloat(base);
  return Number.isFinite(n) ? n : undefined;
}

export async function parseQuery(raw: string, locale: 'en' | 'ar'): Promise<Parsed> {
  const q0 = normalizeDigits(raw).toLowerCase();
  const q = q0.normalize('NFKC');

  // bedrooms
  let bedrooms: number | undefined;
  const bedReEn = /(\b|_)(?:bed|beds|bedroom|bedrooms)\s*(\d{1,2})/i;
  const bedReAr = /(\b|_)(?:غرف|غرفة|نوم)\s*(\d{1,2})/i;
  const mBed = q.match(locale === 'ar' ? bedReAr : bedReEn) || q.match(bedReEn) || q.match(bedReAr);
  if (mBed) bedrooms = parseInt(mBed[2]);

  // year
  let deliveryYear: number | undefined;
  const mYear = q.match(/20\d{2}/);
  if (mYear) deliveryYear = parseInt(mYear[0]);

  // price
  let priceMax: number | undefined;
  const pricePhrases = [
    /(under|below|<=|<|max|budget)\s*([0-9\.]+\s*(?:k|m)?)/i,
    /(اقل|أقل|تحت|حد أقصى|ميزانية)\s*([0-9\.]+\s*(?:k|m|مليون)?)/i,
    /\b([0-9\.]+\s*(?:k|m|مليون))\s*(?:egp|جنيه|جنيه مصري)?/i
  ];
  for (const re of pricePhrases) {
    const m = q.match(re);
    if (m) {
      priceMax = toNumberLike((m[2] as string) || (m[1] as string));
      break;
    }
  }

  // city / district detection from DB values
  let city: string | undefined;
  let district: string | undefined;
  try {
    const allProjects = await prisma.project.findMany({ select: { city: true, district: true } });
    const cities = Array.from(new Set(allProjects.map((p) => p.city?.toLowerCase()).filter(Boolean))) as string[];
    const districts = Array.from(new Set(allProjects.map((p) => p.district?.toLowerCase()).filter(Boolean))) as string[];
    for (const c of cities) if (c && q.includes(c)) city = c;
    for (const d of districts) if (d && q.includes(d)) district = d;
  } catch {
    // if DB not ready, just skip — filters will be empty
  }

  return { locale, priceMax, bedrooms, deliveryYear, city, district, textForEmbedding: q };
}

async function embed(text: string): Promise<number[]> {
  // Try OpenAI embeddings if provided
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
    });
    if (!res.ok) throw new Error(`Embedding error ${res.status}`);
    const json: any = await res.json();
    return json.data[0].embedding as number[];
  }
  // Deterministic fallback vector (length 1536) — works with Float[]
  const vec = new Array(1536).fill(0) as number[];
  let i = 0;
  for (const ch of Array.from(text)) {
    vec[i % 1536] += (ch.codePointAt(0)! % 31) / 31;
    i++;
  }
  return vec;
}

function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function fmtPrice(egp?: number | null, usd?: number | null, currency = 'EGP') {
  if (egp) return `${egp.toLocaleString('en-US')} ${currency}`;
  if (usd) return `${usd.toLocaleString('en-US')} USD`;
  return '—';
}

async function searchUnits(parsed: Parsed, limit = 24) {
  const emb = await embed(parsed.textForEmbedding);

  // Build Prisma filters
  const where: any = {
    project: {}
  };
  if (parsed.priceMax) where.priceEgp = { lte: parsed.priceMax };
  if (parsed.bedrooms) where.bedrooms = parsed.bedrooms;
  if (parsed.deliveryYear) where.project.deliveryDate = { gte: parsed.deliveryYear };
  if (parsed.city) where.project.city = { equals: parsed.city, mode: 'insensitive' };
  if (parsed.district) where.project.district = { equals: parsed.district, mode: 'insensitive' };

  const units = await prisma.unit.findMany({
    where,
    take: limit * 3, // over-fetch, we'll sort by cosine
    include: {
      project: { select: { name: true, lat: true, lng: true } }
    }
  });

  const scored = units.map((u) => ({
    u,
    score: Array.isArray(u.embedding) ? cosine(u.embedding as unknown as number[], emb) : 0
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.u);
}

async function searchSources(parsed: Parsed, limit = 5) {
  const emb = await embed(parsed.textForEmbedding);
  const docs = await prisma.sourceDoc.findMany({
    where: { lang: parsed.locale },
    take: limit * 3
  });
  const scored = docs.map((d) => ({
    d,
    score: Array.isArray(d.embedding) ? cosine(d.embedding as unknown as number[], emb) : 0
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.d);
}

export async function runRag({
  query,
  locale
}: {
  query: string;
  locale: 'en' | 'ar';
}): Promise<RagResult> {
  const parsed = await parseQuery(query, locale);
  const [units, sources] = await Promise.all([searchUnits(parsed), searchSources(parsed)]);

  const pins: RagPin[] = units
    .filter((u) => typeof (u as any).project?.lat === 'number' && typeof (u as any).project?.lng === 'number')
    .map((u: any) => ({
      id: String(u.id),
      lat: Number(u.project.lat),
      lng: Number(u.project.lng),
      title: `${u.project.name} — ${u.type}`,
      price: fmtPrice(u.priceEgp as number | undefined, u.priceUsd as number | undefined, (u.currency as string) || 'EGP'),
      meta: `${u.bedrooms} BR • ${u.sizeSqm} sqm`
    }));

  const answer: RagAnswer = {
    title: locale === 'ar' ? 'أفضل النتائج حسب طلبك' : 'Top matches for your query',
    text:
      locale === 'ar'
        ? `تم تطبيق المرشحات${parsed.city ? ` للمدينة ${parsed.city}` : ''}${parsed.bedrooms ? `، عدد الغرف ${parsed.bedrooms}` : ''}${
            parsed.priceMax ? `، بحد أقصى ${parsed.priceMax.toLocaleString('en-US')} EGP` : ''
          }${parsed.deliveryYear ? `، تسليم بدءًا من ${parsed.deliveryYear}` : ''}.`
        : `Applied filters${parsed.city ? ` for ${parsed.city}` : ''}${parsed.bedrooms ? `, bedrooms ${parsed.bedrooms}` : ''}${
            parsed.priceMax ? `, max ${parsed.priceMax.toLocaleString('en-US')} EGP` : ''
          }${parsed.deliveryYear ? `, delivering from ${parsed.deliveryYear}` : ''}.`,
    sources: sources.map((s: any, i: number) => ({ id: i + 1, title: s.title as string }))
  };

  return { answer, pins };
}