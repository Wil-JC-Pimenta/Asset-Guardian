import { seedAssets } from './asset.seeder';
import { seedMaintenances } from './maintenance.seeder';

export const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Run seeders in order
    await seedAssets();
    await seedMaintenances();
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
}; 