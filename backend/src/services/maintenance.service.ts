import { PrismaClient } from '@prisma/client';
import { MaintenanceRecord } from '@prisma/client';
import { AssetService } from './asset.service';

const prisma = new PrismaClient();

export class MaintenanceService {
  async getAllMaintenances(): Promise<MaintenanceRecord[]> {
    return prisma.maintenanceRecord.findMany({
      include: {
        asset: true,
      },
    });
  }

  async getMaintenanceById(id: string): Promise<MaintenanceRecord | null> {
    return prisma.maintenanceRecord.findUnique({
      where: { id },
      include: {
        asset: true,
      },
    });
  }

  async createMaintenance(data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRecord> {
    const maintenance = await prisma.maintenanceRecord.create({
      data,
      include: {
        asset: true,
      },
    });

    // Atualiza métricas do ativo após criar manutenção
    const metrics = await prisma.asset.findUnique({
      where: { id: data.assetId },
    });

    if (metrics) {
      const assetService = new AssetService();
      const newMetrics = await assetService.calculateMetrics(data.assetId);
      
      await prisma.asset.update({
        where: { id: data.assetId },
        data: newMetrics,
      });
    }

    return maintenance;
  }

  async updateMaintenance(id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const maintenance = await prisma.maintenanceRecord.update({
      where: { id },
      data,
      include: {
        asset: true,
      },
    });

    // Atualiza métricas do ativo após atualizar manutenção
    if (maintenance.assetId) {
      const assetService = new AssetService();
      const newMetrics = await assetService.calculateMetrics(maintenance.assetId);
      
      await prisma.asset.update({
        where: { id: maintenance.assetId },
        data: newMetrics,
      });
    }

    return maintenance;
  }

  async deleteMaintenance(id: string): Promise<MaintenanceRecord> {
    const maintenance = await prisma.maintenanceRecord.delete({
      where: { id },
      include: {
        asset: true,
      },
    });

    // Atualiza métricas do ativo após deletar manutenção
    if (maintenance.assetId) {
      const assetService = new AssetService();
      const newMetrics = await assetService.calculateMetrics(maintenance.assetId);
      
      await prisma.asset.update({
        where: { id: maintenance.assetId },
        data: newMetrics,
      });
    }

    return maintenance;
  }
} 