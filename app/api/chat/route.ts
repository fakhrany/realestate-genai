import { NextRequest } from 'next/server'; import { runRag } from '@/lib/rag';
export async function POST(req: NextRequest){ const body=await req.json(); const { messages=[], locale='en' } = body || {}; const last = messages[messages.length-1]?.content || ''; const result = await runRag({ query: last, locale }); return Response.json(result); }
