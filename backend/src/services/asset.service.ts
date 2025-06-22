import { PrismaClient } from '@prisma/client';
import { Asset } from '@prisma/client';

const prisma = new PrismaClient();

export class AssetService {
  async getAllAssets(): Promise<Asset[]> {
    return prisma.asset.findMany({
      include: {
        maintenance: true,
        fmeaRecords: true,
        reports: true,
      },
    });
  }

  async getAssetById(id: string): Promise<Asset | null> {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        maintenance: true,
        fmeaRecords: true,
        reports: true,
      },
    });
  }

  async createAsset(data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    return prisma.asset.create({
      data,
    });
  }

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
    return prisma.asset.update({
      where: { id },
      data,
    });
  }

  async deleteAsset(id: string): Promise<Asset> {
    return prisma.asset.delete({
      where: { id },
    });
  }

  async calculateMetrics(id: string): Promise<{
    mtbf: number;
    mttr: number;
    oee: number;
    availability: number;
    performance: number;
    quality: number;
  }> {
    const maintenances = await prisma.maintenanceRecord.findMany({
      where: { assetId: id },
      orderBy: { date: 'asc' },
    });

    if (maintenances.length < 2) {
      return {
        mtbf: 0,
        mttr: 0,
        oee: 0,
        availability: 0,
        performance: 0,
        quality: 0,
      };
    }

    let totalUptime = 0;
    let totalDowntime = 0;
    let failureCount = 0;

    for (let i = 1; i < maintenances.length; i++) {
      const currentMaintenance = maintenances[i];
      const previousMaintenance = maintenances[i - 1];

      if (currentMaintenance.type === 'corretiva') {
        failureCount++;
        const downtime = new Date(currentMaintenance.date).getTime() - 
                        new Date(previousMaintenance.date).getTime();
        totalDowntime += downtime;
      }

      const uptime = new Date(currentMaintenance.date).getTime() - 
                    new Date(previousMaintenance.date).getTime();
      totalUptime += uptime;
    }

    const mtbf = failureCount > 0 ? totalUptime / (failureCount * 1000 * 60 * 60) : 0;
    const mttr = failureCount > 0 ? totalDowntime / (failureCount * 1000 * 60 * 60) : 0;

    const plannedProductionTime = 24 * 30; // 30 dias em horas
    const availability = (plannedProductionTime - totalDowntime / (1000 * 60 * 60)) / plannedProductionTime;
    const performance = 0.9; // Simulado
    const quality = 0.95; // Simulado
    const oee = availability * performance * quality;

    return {
      mtbf,
      mttr,
      oee,
      availability,
      performance,
      quality,
    };
  }
} 