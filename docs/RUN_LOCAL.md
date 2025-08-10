npm install
cp .env.example .env.local
# Set DATABASE_URL, enable pgvector in DB
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.ts
npm run dev
