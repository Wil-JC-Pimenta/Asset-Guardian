import { PrismaClient } from '@prisma/client';
import { FMEARecord } from '@prisma/client';

const prisma = new PrismaClient();

export class FMEAService {
  async getAllFMEAs(): Promise<FMEARecord[]> {
    return prisma.fMEARecord.findMany({
      include: {
        asset: true,
      },
    });
  }

  async getFMEAById(id: string): Promise<FMEARecord | null> {
    return prisma.fMEARecord.findUnique({
      where: { id },
      include: {
        asset: true,
      },
    });
  }

  async createFMEA(data: Omit<FMEARecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<FMEARecord> {
    return prisma.fMEARecord.create({
      data,
      include: {
        asset: true,
      },
    });
  }

  async updateFMEA(id: string, data: Partial<FMEARecord>): Promise<FMEARecord> {
    return prisma.fMEARecord.update({
      where: { id },
      data,
      include: {
        asset: true,
      },
    });
  }

  async deleteFMEA(id: string): Promise<FMEARecord> {
    return prisma.fMEARecord.delete({
      where: { id },
      include: {
        asset: true,
      },
    });
  }
} 