// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Reusable zero-vector for pgvector columns (1536 dims)
const zeroVector = Array(1536).fill(0) as number[];

// Helpers
const now = () => new Date();
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('Seeding developers…');

  // 1) Developers
  const developers = [
    { name: 'Orascom Development', country: 'EG', website: 'https://www.orascomdh.com/' },
    { name: 'Talaat Moustafa Group', country: 'EG', website: 'https://www.tmg.com.eg/' },
    { name: 'SODIC', country: 'EG', website: 'https://www.sodic.com/' },
    { name: 'Palm Hills Developments', country: 'EG', website: 'https://www.palmhillsdevelopments.com/' },
    { name: 'Mountain View', country: 'EG', website: 'https://mountainviewegypt.com/' },
    { name: 'Emaar Misr', country: 'EG', website: 'https://www.emaarmisr.com/' }
  ];

  const devRecords = {} as Record<string, { id: string }>;
  for (const d of developers) {
    const rec = await prisma.developer.upsert({
      where: { name: d.name }, // name is unique in our seed logic
      update: { ...d, updatedAt: now() },
      create: { ...d }
    });
    devRecords[d.name] = { id: rec.id };
  }

  console.log('Seeding projects…');

  // 2) Projects (tie to developers)
  const projects: Array<Prisma.ProjectCreateInput & { key: string }> = [
    {
      key: 'O West',
      name: 'O West',
      city: '6th of October',
      district: 'West Cairo',
      lat: 29.954,
      lng: 30.916,
      deliveryDate: 2027,
      amenities: ['Clubhouse', 'Parks'],
      description: 'Integrated town in West Cairo.',
      developer: { connect: { id: devRecords['Orascom Development'].id } }
    },
    {
      key: 'Madinaty',
      name: 'Madinaty',
      city: 'New Cairo',
      district: 'East Cairo',
      lat: 30.113,
      lng: 31.628,
      deliveryDate: 2028,
      amenities: ['Golf', 'Schools', 'Hospitals'],
      description: 'A full city by TMG.',
      developer: { connect: { id: devRecords['Talaat Moustafa Group'].id } }
    },
    {
      key: 'Eastown',
      name: 'Eastown',
      city: 'New Cairo',
      district: '5th Settlement',
      lat: 30.023,
      lng: 31.486,
      deliveryDate: 2026,
      amenities: ['Mall', 'Security'],
      description: 'Apartments & townhomes in a prime spot.',
      developer: { connect: { id: devRecords['SODIC'].id } }
    },
    {
      key: 'Palm Hills October',
      name: 'Palm Hills October',
      city: '6th of October',
      district: 'West Cairo',
      lat: 29.987,
      lng: 30.943,
      deliveryDate: 2027,
      amenities: ['Club', 'Green areas'],
      description: 'Villas and apartments community.',
      developer: { connect: { id: devRecords['Palm Hills Developments'].id } }
    },
    {
      key: 'Mountain View iCity New Cairo',
      name: 'Mountain View iCity New Cairo',
      city: 'New Cairo',
      district: '5th Settlement',
      lat: 30.030,
      lng: 31.482,
      deliveryDate: 2027,
      amenities: ['Lagoons', 'Clubhouse'],
      description: 'Smart city concept with parks and lagoons.',
      developer: { connect: { id: devRecords['Mountain View'].id } }
    },
    {
      key: 'Uptown Cairo',
      name: 'Uptown Cairo',
      city: 'Cairo',
      district: 'Moqattam',
      lat: 30.064,
      lng: 31.287,
      deliveryDate: 2026,
      amenities: ['Golf', 'Club'],
      description: 'Hilltop community with city views.',
      developer: { connect: { id: devRecords['Emaar Misr'].id } }
    },
    {
      key: 'Cairo Gate',
      name: 'Cairo Gate',
      city: 'Sheikh Zayed',
      district: 'West Cairo',
      lat: 30.056,
      lng: 30.955,
      deliveryDate: 2027,
      amenities: ['Retail', 'Security'],
      description: 'Emaar’s West Cairo masterplan.',
      developer: { connect: { id: devRecords['Emaar Misr'].id } }
    },
    {
      key: 'SODIC VILLETTE',
      name: 'Villette',
      city: 'New Cairo',
      district: '5th Settlement',
      lat: 30.011,
      lng: 31.484,
      deliveryDate: 2026,
      amenities: ['Sports Club', 'Parks'],
      description: 'Low-rise living with generous open spaces.',
      developer: { connect: { id: devRecords['SODIC'].id } }
    },
    {
      key: 'Mountain View October Park',
      name: 'Mountain View October Park',
      city: '6th of October',
      district: 'West Cairo',
      lat: 29.974,
      lng: 30.939,
      deliveryDate: 2027,
      amenities: ['Lakes', 'Walking trails'],
      description: 'Family-focused community.',
      developer: { connect: { id: devRecords['Mountain View'].id } }
    },
    {
      key: 'Palm Hills New Cairo',
      name: 'Palm Hills New Cairo',
      city: 'New Cairo',
      district: 'East Cairo',
      lat: 30.010,
      lng: 31.600,
      deliveryDate: 2028,
      amenities: ['Club', 'Parks'],
      description: 'Apartments & villas with amenities.',
      developer: { connect: { id: devRecords['Palm Hills Developments'].id } }
    }
  ];

  // Upsert projects by (developerId + name) uniqueness we enforce manually
  const projectMap: Record<string, string> = {};
  for (const p of projects) {
    // Upsert via a synthetic unique: name + developerId. If you have a unique in schema, switch to it.
    const created = await prisma.project.create({
      data: {
        name: p.name,
        city: p.city,
        district: p.district,
        lat: p.lat,
        lng: p.lng,
        deliveryDate: p.deliveryDate,
        amenities: p.amenities,
        description: p.description,
        developer: p.developer
      }
    });
    projectMap[p.key] = created.id;
  }

  console.log('Seeding units…');

  // 3) Units (3 per project)
  const unitType = (i: number) =>
    i % 3 === 0 ? 'apartment' : i % 3 === 1 ? 'villa' : 'twin';

  const availability = (i: number) =>
    i % 5 === 0 ? 'reserved' : i % 7 === 0 ? 'sold' : 'available';

  const unitForProject = (projectKey: string, idxBase = 0) => {
    const pid = projectMap[projectKey];
    const list: Prisma.UnitCreateManyInput[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = idxBase + i;
      list.push({
        projectId: pid,
        type: unitType(idx),
        bedrooms: rand(1, 4),
        bathrooms: rand(1, 3),
        sizeSqm: rand(90, 260),
        priceEgp: rand(3_500_000, 25_000_000),
        currency: 'EGP',
        images: [],
        paymentPlan: {
          down: [5, 10, 15][rand(0, 2)],
          years: [5, 7, 8, 10][rand(0, 3)]
        } as unknown as Prisma.InputJsonValue,
        availability: availability(idx),
        floor: rand(0, 10),
        view: ['park', 'street', 'club', 'lake'][rand(0, 3)],
        // embedding is required in schema, but createMany cannot set arrays w/ native mapping across all drivers reliably.
        // So we’ll insert via create (not createMany) below to ensure embedding gets written.
      });
    }
    return list;
  };

  const unitsPlan = [
    ...unitForProject('O West', 0),
    ...unitForProject('Madinaty', 10),
    ...unitForProject('Eastown', 20),
    ...unitForProject('Palm Hills October', 30),
    ...unitForProject('Mountain View iCity New Cairo', 40),
    ...unitForProject('Uptown Cairo', 50),
    ...unitForProject('Cairo Gate', 60),
    ...unitForProject('SODIC VILLETTE', 70),
    ...unitForProject('Mountain View October Park', 80),
    ...unitForProject('Palm Hills New Cairo', 90)
  ];

  // Insert units one-by-one to guarantee embedding gets set
  for (const u of unitsPlan) {
    await prisma.unit.create({
      data: {
        projectId: u.projectId!,
        type: u.type!,
        bedrooms: u.bedrooms!,
        bathrooms: u.bathrooms,
        sizeSqm: u.sizeSqm!,
        priceEgp: u.priceEgp,
        priceUsd: u.priceUsd,
        currency: u.currency,
        images: u.images ?? [],
        paymentPlan: u.paymentPlan as Prisma.InputJsonValue,
        availability: u.availability!,
        floor: u.floor,
        view: u.view,
        embedding: zeroVector
      }
    });
  }

  console.log('Seeding source docs…');

  // 4) Source docs for RAG (optional)
  const sourceDocs = [
    {
      title: 'O West Overview EN',
      url: 'https://example.com/owest/en',
      lang: 'en'
    },
    {
      title: 'معلومات مشروع مدينتي',
      url: 'https://example.com/madinaty/ar',
      lang: 'ar'
    },
    {
      title: 'Eastown Factsheet EN',
      url: 'https://example.com/eastown/en',
      lang: 'en'
    }
  ];

  for (const s of sourceDocs) {
    await prisma.sourceDoc.upsert({
      where: { title: s.title },
      update: { url: s.url, lang: s.lang, embedding: zeroVector },
      create: { ...s, embedding: zeroVector }
    });
  }

  console.log('✅ Seed finished');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });