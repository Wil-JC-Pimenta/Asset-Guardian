import { seedAssets } from './seeders/asset.seeder';

const runSeeds = async () => {
  console.log('🌱 Starting database seeding...');
  await seedAssets();
  console.log('✨ Seeding completed!');
  process.exit(0);
};

runSeeds().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}); 