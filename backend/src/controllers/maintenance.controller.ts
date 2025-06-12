import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getMaintenanceRecords = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'date', sortOrder = 'desc', assetId, type, status } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (assetId) {
      where.assetId = assetId as string;
    }

    if (type) {
      where.type = type as string;
    }

    if (status) {
      where.status = status as string;
    }

    const [records, total] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: {
          asset: true,
        },
      }),
      prisma.maintenanceRecord.count({ where }),
    ]);

    res.json({
      data: records,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
};

export const getMaintenanceRecordById = async (req: Request, res: Response) => {
  try {
    const record = await prisma.maintenanceRecord.findUnique({
      where: { id: req.params.id },
      include: { asset: true },
    });

    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance record' });
  }
};

export const createMaintenanceRecord = async (req: Request, res: Response) => {
  try {
    const maintenance = await prisma.maintenanceRecord.create({
      data: req.body,
    });

    // Update asset's last maintenance date
    await prisma.asset.update({
      where: { id: maintenance.assetId },
      data: { lastMaintenance: maintenance.date },
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({ error: 'Failed to create maintenance record' });
  }
};

export const updateMaintenanceRecord = async (req: Request, res: Response) => {
  try {
    const existingRecord = await prisma.maintenanceRecord.findUnique({
      where: { id: req.params.id },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    const updatedRecord = await prisma.maintenanceRecord.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
};

export const deleteMaintenanceRecord = async (req: Request, res: Response) => {
  try {
    const existingRecord = await prisma.maintenanceRecord.findUnique({
      where: { id: req.params.id },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    await prisma.maintenanceRecord.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ error: 'Failed to delete maintenance record' });
  }
};
