import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function upsertSource(title:string, lang:string){ return prisma.sourceDoc.upsert({ where:{ title }, update:{}, create:{ title, lang, embedding: new Array(1536).fill(0) as any } }); }
async function main(){
  const palm = await prisma.developer.create({ data: { name:'Palm Hills', country:'EG', website:'https://palmhillsdevelopments.com' } });
  const sodic = await prisma.developer.create({ data: { name:'SODIC', country:'EG', website:'https://www.sodic.com' } });
  const talaat = await prisma.developer.create({ data: { name:'Talaat Moustafa Group', country:'EG' } });
  const emaar = await prisma.developer.create({ data: { name:'Emaar Misr', country:'EG' } });
  const mountain = await prisma.developer.create({ data: { name:'Mountain View', country:'EG' } });
  const newgiza = await prisma.developer.create({ data: { name:'New Giza', country:'EG' } });
  const badya = await prisma.project.create({ data: { name:'Badya', developerId:palm.id, city:'6th of October', district:'Badya', lat:29.971, lng:30.926, deliveryDate:2026 } });
  const villette = await prisma.project.create({ data: { name:'Villette', developerId:sodic.id, city:'New Cairo', district:'5th Settlement', lat:30.017, lng:31.445, deliveryDate:2025 } });
  const madinaty = await prisma.project.create({ data: { name:'Madinaty', developerId:talaat.id, city:'New Cairo', district:'Madinaty', lat:30.116, lng:31.637, deliveryDate:2027 } });
  const marassi = await prisma.project.create({ data: { name:'Marassi', developerId:emaar.id, city:'North Coast', district:'Sidi Abdel Rahman', lat:31.037, lng:28.418, deliveryDate:2026 } });
  const mv_icarus = await prisma.project.create({ data: { name:'Mountain View iCity', developerId:mountain.id, city:'New Cairo', district:'iCity', lat:30.061, lng:31.522, deliveryDate:2025 } });
  const ng_compound = await prisma.project.create({ data: { name:'New Giza', developerId:newgiza.id, city:'6th of October', district:'New Giza', lat:29.969, lng:30.892, deliveryDate:2025 } });
  const units=[
    { projectId: badya.id, type:'villa', bedrooms:4, sizeSqm:250, priceEgp:9200000, currency:'EGP' },
    { projectId: badya.id, type:'apartment', bedrooms:3, sizeSqm:145, priceEgp:5800000, currency:'EGP' },
    { projectId: badya.id, type:'twin', bedrooms:3, sizeSqm:180, priceEgp:7600000, currency:'EGP' },
    { projectId: villette.id, type:'apartment', bedrooms:2, sizeSqm:120, priceEgp:6500000, currency:'EGP' },
    { projectId: villette.id, type:'villa', bedrooms:4, sizeSqm:260, priceEgp:11200000, currency:'EGP' },
    { projectId: villette.id, type:'th', bedrooms:3, sizeSqm:170, priceEgp:8200000, currency:'EGP' },
    { projectId: madinaty.id, type:'apartment', bedrooms:3, sizeSqm:155, priceEgp:7000000, currency:'EGP' },
    { projectId: madinaty.id, type:'apartment', bedrooms:2, sizeSqm:110, priceEgp:5200000, currency:'EGP' },
    { projectId: madinaty.id, type:'villa', bedrooms:5, sizeSqm:320, priceEgp:14500000, currency:'EGP' },
    { projectId: marassi.id, type:'apartment', bedrooms:2, sizeSqm:105, priceEgp:9800000, currency:'EGP' },
    { projectId: marassi.id, type:'villa', bedrooms:4, sizeSqm:240, priceEgp:22000000, currency:'EGP' },
    { projectId: marassi.id, type:'twin', bedrooms:3, sizeSqm:185, priceEgp:16800000, currency:'EGP' },
    { projectId: mv_icarus.id, type:'apartment', bedrooms:2, sizeSqm:115, priceEgp:5600000, currency:'EGP' },
    { projectId: mv_icarus.id, type:'apartment', bedrooms:3, sizeSqm:140, priceEgp:6700000, currency:'EGP' },
    { projectId: mv_icarus.id, type:'villa', bedrooms:4, sizeSqm:230, priceEgp:11900000, currency:'EGP' },
    { projectId: ng_compound.id, type:'villa', bedrooms:4, sizeSqm:245, priceEgp:12800000, currency:'EGP' },
    { projectId: ng_compound.id, type:'apartment', bedrooms:2, sizeSqm:118, priceEgp:5900000, currency:'EGP' },
    { projectId: ng_compound.id, type:'th', bedrooms:3, sizeSqm:175, priceEgp:9300000, currency:'EGP' },
    { projectId: badya.id, type:'apartment', bedrooms:3, sizeSqm:150, priceEgp:6100000, currency:'EGP' },
    { projectId: badya.id, type:'apartment', bedrooms:2, sizeSqm:95, priceEgp:4200000, currency:'EGP' },
    { projectId: villette.id, type:'apartment', bedrooms:1, sizeSqm:80, priceEgp:3600000, currency:'EGP' },
    { projectId: villette.id, type:'apartment', bedrooms:2, sizeSqm:110, priceEgp:4800000, currency:'EGP' },
    { projectId: madinaty.id, type:'apartment', bedrooms:4, sizeSqm:180, priceEgp:9200000, currency:'EGP' },
    { projectId: madinaty.id, type:'th', bedrooms:3, sizeSqm:190, priceEgp:10100000, currency:'EGP' },
    { projectId: marassi.id, type:'apartment', bedrooms:3, sizeSqm:130, priceEgp:12500000, currency:'EGP' },
    { projectId: marassi.id, type:'apartment', bedrooms:1, sizeSqm:75, priceEgp:8400000, currency:'EGP' },
    { projectId: mv_icarus.id, type:'twin', bedrooms:3, sizeSqm:178, priceEgp:9400000, currency:'EGP' },
    { projectId: mv_icarus.id, type:'apartment', bedrooms:2, sizeSqm:100, priceEgp:5100000, currency:'EGP' },
    { projectId: ng_compound.id, type:'apartment', bedrooms:3, sizeSqm:135, priceEgp:7700000, currency:'EGP' },
    { projectId: ng_compound.id, type:'apartment', bedrooms:1, sizeSqm:70, priceEgp:3500000, currency:'EGP' }
  ]; await prisma.unit.createMany({ data: units });
  await upsertSource('Palm Hills — Badya brochure','en'); await upsertSource('سوديك — فيليت نظرة عامة','ar'); await upsertSource('TMG — مدينتي تفاصيل الأسعار','ar'); await upsertSource('Emaar — Marassi overview','en');
  console.log('Seed done.');
}
main().catch(e=>{ console.error(e); process.exit(1); }).finally(async()=>{ await prisma.$disconnect(); });
