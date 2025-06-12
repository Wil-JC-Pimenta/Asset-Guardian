import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, checkDatabaseConnection, closeDatabase } from './config/database';
import assetRoutes from './routes/asset.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import { runSeeders } from './seeders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5177'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);

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

// Development route for seeding data
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/seed', async (req, res) => {
    try {
      await runSeeders();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ 
        message: 'Error seeding database',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✅ Database connected successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Shutting down server...');
      
      server.close(async () => {
        console.log('✅ Server closed');
        try {
          await closeDatabase();
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};

startServer();
