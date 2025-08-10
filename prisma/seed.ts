// prisma/seed.ts
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// create a 1536-length zero vector once and reuse it
const zeroVector = Array(1536).fill(0) as number[];

async function main() {
  // ... your existing seed data

  // Example developer/project/unit creates (add embedding: zeroVector)
  const dev = await prisma.developer.create({
    data: { name: 'Orascom Development', country: 'EG', website: 'https://orascom.com' }
  });

  const proj = await prisma.project.create({
    data: {
      developerId: dev.id,
      name: 'O West',
      city: '6th of October',
      district: 'West Cairo',
      lat: 29.954,
      lng: 30.916,
      deliveryDate: 2027,
      amenities: ['Clubhouse', 'Parks'],
      description: 'Integrated town.'
    }
  });

  // wherever you create units, include embedding: zeroVector
  await prisma.unit.create({
    data: {
      projectId: proj.id,
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 120,
      priceEgp: 7000000,
      currency: 'EGP',
      images: [],
      paymentPlan: { down: 10, years: 7 },
      availability: 'available',
      floor: 3,
      view: 'park',
      embedding: zeroVector
    }
  });

  // If you seed SourceDoc, include embedding: zeroVector
  await prisma.sourceDoc.create({
    data: {
      title: 'Company Brochure',
      url: 'https://example.com/brochure',
      lang: 'en',
      embedding: zeroVector
    }
  });

  // ...repeat embedding: zeroVector for every new Unit or SourceDoc you insert
}

main()
  .then(async () => {
    console.log('Seed done');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });