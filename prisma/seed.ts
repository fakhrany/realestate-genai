/* eslint-disable no-console */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Helper for nullable JSON columns (use SQL NULL)
const JSON_DB_NULL: Prisma.NullableJsonNullValueInput = Prisma.DbNull;

type DevSeed = {
  name: string;
  logo?: string | null;
  country?: string | null;
  website?: string | null;
};

type ProjectSeed = {
  developerName: string; // resolve to developerId
  name: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  deliveryDate?: number | null; // year
  amenities?: string[] | null;
  description?: string | null;
};

type UnitSeed = {
  projectName: string; // resolve to projectId
  type: 'apartment' | 'villa' | 'th' | 'twin';
  bedrooms: number;
  bathrooms?: number | null;
  sizeSqm: number;
  priceEgp?: number | null;
  priceUsd?: number | null;
  currency?: string | null;
  images?: string[] | null;
  paymentPlan?: Record<string, unknown> | null; // JSON
  availability?: 'available' | 'reserved' | 'sold';
  floor?: number | null;
  view?: string | null;
};

const developers: DevSeed[] = [
  { name: 'Palm Hills', country: 'Egypt', website: 'https://example.com' },
  { name: 'SODIC', country: 'Egypt', website: 'https://example.com' },
  { name: 'Talaat Moustafa Group', country: 'Egypt', website: 'https://example.com' },
  { name: 'Emaar Misr', country: 'Egypt', website: 'https://example.com' },
  { name: 'Mountain View', country: 'Egypt', website: 'https://example.com' },
];

const projects: ProjectSeed[] = [
  {
    developerName: 'Palm Hills',
    name: 'Palm Hills New Cairo',
    city: 'New Cairo',
    district: '5th Settlement',
    lat: 30.0075,
    lng: 31.4913,
    deliveryDate: 2026,
    amenities: ['Clubhouse', 'Pools'],
    description: 'Modern community in New Cairo.',
  },
  {
    developerName: 'SODIC',
    name: 'SODIC West',
    city: '6th of October',
    district: 'Beverly Hills',
    lat: 29.9968,
    lng: 30.9767,
    deliveryDate: 2025,
    amenities: ['Parks', 'Retail'],
    description: 'Established district in West Cairo.',
  },
];

const units: UnitSeed[] = [
  {
    projectName: 'Palm Hills New Cairo',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 145,
    priceEgp: 8200000,
    currency: 'EGP',
    availability: 'available',
    floor: 3,
    view: 'Garden',
  },
  {
    projectName: 'SODIC West',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 120,
    priceEgp: 5200000,
    currency: 'EGP',
    availability: 'available',
  },
];

const now = () => new Date();

function toJsonInput(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === undefined || value === null) return JSON_DB_NULL;
  return value as Prisma.InputJsonValue;
}

async function upsertDeveloper(d: DevSeed) {
  const existing = await prisma.developer.findFirst({ where: { name: d.name } });
  if (existing) {
    return prisma.developer.update({
      where: { id: existing.id },
      data: {
        logo: d.logo ?? existing.logo ?? null,
        country: d.country ?? existing.country ?? null,
        website: d.website ?? existing.website ?? null,
        updatedAt: now(),
      },
    });
  }
  return prisma.developer.create({
    data: {
      name: d.name,
      logo: d.logo ?? null,
      country: d.country ?? null,
      website: d.website ?? null,
      createdAt: now(),
      updatedAt: now(),
    },
  });
}

async function upsertProject(p: ProjectSeed) {
  const dev = await prisma.developer.findFirst({ where: { name: p.developerName }, select: { id: true } });
  if (!dev) throw new Error(`Developer "${p.developerName}" not found for project "${p.name}".`);

  const existing = await prisma.project.findFirst({ where: { name: p.name, developerId: dev.id } });
  if (existing) {
    return prisma.project.update({
      where: { id: existing.id },
      data: {
        city: p.city,
        district: p.district,
        lat: p.lat,
        lng: p.lng,
        deliveryDate: p.deliveryDate ?? existing.deliveryDate ?? null,
        amenities: p.amenities ?? existing.amenities ?? [],
        description: p.description ?? existing.description ?? null,
        updatedAt: now(),
      },
    });
  }
  return prisma.project.create({
    data: {
      developerId: dev.id,
      name: p.name,
      city: p.city,
      district: p.district,
      lat: p.lat,
      lng: p.lng,
      deliveryDate: p.deliveryDate ?? null,
      amenities: p.amenities ?? [],
      description: p.description ?? null,
      createdAt: now(),
      updatedAt: now(),
    },
  });
}

async function upsertUnit(u: UnitSeed) {
  const project = await prisma.project.findFirst({ where: { name: u.projectName }, select: { id: true } });
  if (!project) throw new Error(`Project "${u.projectName}" not found for unit.`);

  const existing = await prisma.unit.findFirst({
    where: { projectId: project.id, type: u.type, bedrooms: u.bedrooms, sizeSqm: u.sizeSqm, floor: u.floor ?? undefined },
  });

  if (existing) {
    return prisma.unit.update({
      where: { id: existing.id },
      data: {
        bathrooms: u.bathrooms ?? existing.bathrooms ?? null,
        priceEgp: u.priceEgp ?? existing.priceEgp ?? null,
        priceUsd: u.priceUsd ?? existing.priceUsd ?? null,
        currency: u.currency ?? existing.currency ?? 'EGP',
        images: (u.images ?? existing.images ?? []) as string[],
        paymentPlan: u.paymentPlan !== undefined ? toJsonInput(u.paymentPlan) : toJsonInput(existing.paymentPlan),
        availability: u.availability ?? existing.availability ?? 'available',
        view: u.view ?? existing.view ?? null,
        updatedAt: now(),
      },
    });
  }

  return prisma.unit.create({
    data: {
      projectId: project.id,
      type: u.type,
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms ?? null,
      sizeSqm: u.sizeSqm,
      priceEgp: u.priceEgp ?? null,
      priceUsd: u.priceUsd ?? null,
      currency: u.currency ?? 'EGP',
      images: (u.images ?? []) as string[],
      paymentPlan: toJsonInput(u.paymentPlan ?? null),
      availability: u.availability ?? 'available',
      floor: u.floor ?? null,
      view: u.view ?? null,
      createdAt: now(),
      updatedAt: now(),
    },
  });
}

async function main() {
  console.log('Seeding developers...');
  for (const d of developers) await upsertDeveloper(d);

  console.log('Seeding projects...');
  for (const p of projects) await upsertProject(p);

  console.log('Seeding units...');
  for (const u of units) await upsertUnit(u);

  console.log('Seed completed ✅');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });