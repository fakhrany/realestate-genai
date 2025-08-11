/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DevSeed = {
  name: string;
  logo?: string | null;
  country?: string | null;
  website?: string | null;
};

type ProjectSeed = {
  developerName: string; // we’ll resolve to developerId
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
  projectName: string; // we’ll resolve to projectId
  type: 'apartment' | 'villa' | 'th' | 'twin';
  bedrooms: number;
  bathrooms?: number | null;
  sizeSqm: number;
  priceEgp?: number | null;
  priceUsd?: number | null;
  currency?: string | null;
  images?: string[] | null;
  paymentPlan?: Record<string, unknown> | null;
  availability?: 'available' | 'reserved' | 'sold';
  floor?: number | null;
  view?: string | null;
};

// ---------- SAMPLE SEED DATA (small but enough to boot the app) ----------
const developers: DevSeed[] = [
  { name: 'Palm Hills', country: 'Egypt', website: 'https://example.com' },
  { name: 'SODIC', country: 'Egypt', website: 'https://example.com' },
  { name: 'Talaat Moustafa Group', country: 'Egypt', website: 'https://example.com' },
  { name: 'Emaar Misr', country: 'Egypt', website: 'https://example.com' },
  { name: 'Mountain View', country: 'Egypt', website: 'https://example.com' },
  { name: 'New City Dev', country: 'Egypt', website: 'https://example.com' },
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
  {
    developerName: 'Emaar Misr',
    name: 'Mivida',
    city: 'New Cairo',
    district: '90th Street',
    lat: 30.0209,
    lng: 31.4577,
    deliveryDate: 2027,
    amenities: ['Mall', 'Schools'],
    description: 'Green community by Emaar.',
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
    projectName: 'Palm Hills New Cairo',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 310,
    priceEgp: 21500000,
    currency: 'EGP',
    availability: 'available',
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
  {
    projectName: 'Mivida',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 160,
    priceEgp: 9800000,
    currency: 'EGP',
    availability: 'reserved',
  },
];

// -------------------- UTILS --------------------
function now() {
  return new Date();
}

async function findOrCreateDeveloper(d: DevSeed) {
  const existing = await prisma.developer.findFirst({
    where: { name: d.name },
  });
  if (existing) {
    // Update minimal fields (avoid touching id)
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

async function findOrCreateProject(p: ProjectSeed) {
  // Resolve developerId by name
  const dev = await prisma.developer.findFirst({
    where: { name: p.developerName },
    select: { id: true },
  });
  if (!dev) {
    throw new Error(
      `Developer "${p.developerName}" not found while seeding project "${p.name}".`
    );
  }

  const existing = await prisma.project.findFirst({
    where: { name: p.name, developerId: dev.id },
  });

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

async function findOrCreateUnit(u: UnitSeed) {
  // Resolve projectId by name
  const project = await prisma.project.findFirst({
    where: { name: u.projectName },
    select: { id: true },
  });
  if (!project) {
    throw new Error(
      `Project "${u.projectName}" not found while seeding a unit.`
    );
  }

  // There’s no natural unique key; pick a “near-unique” fingerprint for seed purposes
  const existing = await prisma.unit.findFirst({
    where: {
      projectId: project.id,
      type: u.type,
      bedrooms: u.bedrooms,
      sizeSqm: u.sizeSqm,
      floor: u.floor ?? undefined,
    },
  });

  if (existing) {
    return prisma.unit.update({
      where: { id: existing.id },
      data: {
        bathrooms: u.bathrooms ?? existing.bathrooms ?? null,
        priceEgp: u.priceEgp ?? existing.priceEgp ?? null,
        priceUsd: u.priceUsd ?? existing.priceUsd ?? null,
        currency: u.currency ?? existing.currency ?? 'EGP',
        images: u.images ?? existing.images ?? [],
        paymentPlan: u.paymentPlan ?? existing.paymentPlan ?? null,
        availability: u.availability ?? existing.availability ?? 'available',
        view: u.view ?? existing.view ?? null,
        updatedAt: now(),
        // don’t touch embedding here; your RAG job can update it later
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
      images: u.images ?? [],
      paymentPlan: u.paymentPlan ?? null,
      availability: u.availability ?? 'available',
      floor: u.floor ?? null,
      view: u.view ?? null,
      createdAt: now(),
      updatedAt: now(),
      // embedding left null; a background script can fill it
    },
  });
}

// -------------------- MAIN --------------------
async function main() {
  console.log('Seeding developers...');
  for (const d of developers) {
    await findOrCreateDeveloper(d);
  }

  console.log('Seeding projects...');
  for (const p of projects) {
    await findOrCreateProject(p);
  }

  console.log('Seeding units...');
  for (const u of units) {
    await findOrCreateUnit(u);
  }

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