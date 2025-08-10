import { NextRequest } from 'next/server'; import { prisma } from '@/lib/db'; import { ProjectDTO } from '@/lib/validation';
export async function PUT(req:NextRequest,{ params }:{ params:{ id:string }}){ const json=await req.json(); const data=ProjectDTO.partial().parse(json); const updated=await prisma.project.update({ where:{ id: params.id }, data }); return Response.json(updated); }
export async function DELETE(_req:NextRequest,{ params }:{ params:{ id:string }}){ await prisma.project.delete({ where:{ id: params.id } }); return new Response(null,{ status:204 }); }
