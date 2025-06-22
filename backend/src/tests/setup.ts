import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Limpa o banco de dados antes de cada teste
  await prisma.maintenanceRecord.deleteMany();
  await prisma.fMEARecord.deleteMany();
  await prisma.report.deleteMany();
  await prisma.asset.deleteMany();
}); 