import { NextRequest } from 'next/server'; import { prisma } from '@/lib/db'; import { DeveloperDTO } from '@/lib/validation';
export async function PUT(req:NextRequest,{ params }:{ params:{ id:string }}){ const json=await req.json(); const data=DeveloperDTO.partial().parse(json); const updated=await prisma.developer.update({ where:{ id: params.id }, data }); return Response.json(updated); }
export async function DELETE(_req:NextRequest,{ params }:{ params:{ id:string }}){ await prisma.developer.delete({ where:{ id: params.id } }); return new Response(null,{ status:204 }); }
