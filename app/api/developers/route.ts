import { NextRequest } from 'next/server'; import { prisma } from '@/lib/db'; import { DeveloperDTO } from '@/lib/validation';
export async function GET(){ const items=await prisma.developer.findMany({ orderBy:{ createdAt:'desc' }}); return Response.json(items); }
export async function POST(req:NextRequest){ const json=await req.json(); const data=DeveloperDTO.parse(json); const created=await prisma.developer.create({ data }); return Response.json(created,{ status:201 }); }
