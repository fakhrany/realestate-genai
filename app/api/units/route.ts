import { NextRequest } from 'next/server'; import { prisma } from '@/lib/db'; import { UnitDTO } from '@/lib/validation';
export async function GET(){ const items=await prisma.unit.findMany({ include:{ project:true }, orderBy:{ createdAt:'desc' }}); return Response.json(items); }
export async function POST(req:NextRequest){ const json=await req.json(); const data=UnitDTO.parse(json); const created=await prisma.unit.create({ data }); return Response.json(created,{ status:201 }); }
