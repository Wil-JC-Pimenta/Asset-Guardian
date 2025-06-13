import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import assetRoutes from './routes/asset.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import fmeaRoutes from './routes/fmea.routes';
import { seedAssets } from './seeders/asset.seeder';
import { seedMaintenances } from './seeders/maintenance.seeder';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection check
const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// API routes
app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fmea', fmeaRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Asset Guardian CRM API' });
});

// Health check route
app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // Initialize database connection
    await prisma.$connect();
    console.log('Database connection initialized');
    
    // Run seeders
    await seedAssets();
    await seedMaintenances();
    
    app.listen(PORT, () => {
      console.log(`✅ Database connected successfully`);
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
