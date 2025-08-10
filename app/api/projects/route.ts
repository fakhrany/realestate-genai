import { NextRequest } from 'next/server'; import { prisma } from '@/lib/db'; import { ProjectDTO } from '@/lib/validation';
export async function GET(){ const items=await prisma.project.findMany({ include:{ developer:true }, orderBy:{ createdAt:'desc' }}); return Response.json(items); }
export async function POST(req:NextRequest){ const json=await req.json(); const data=ProjectDTO.parse(json); const created=await prisma.project.create({ data }); return Response.json(created,{ status:201 }); }
