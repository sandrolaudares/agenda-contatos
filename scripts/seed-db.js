import { config } from 'dotenv';
import { seedDatabase, initializeDatabase } from '../src/lib/utils/database.js';

config();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  const isReady = await initializeDatabase();
  if (!isReady) {
    console.error('❌ Database is not ready. Please run setup first.');
    process.exit(1);
  }
  
  await seedDatabase();
  console.log('✅ Database seeding completed!');
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});