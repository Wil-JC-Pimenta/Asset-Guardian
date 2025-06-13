import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', search, status, type } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status as string;
    }

    if (type) {
      where.type = type as string;
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: {
          maintenance: true,
        },
      }),
      prisma.asset.count({ where }),
    ]);

    res.json({
      data: assets,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: { maintenance: true },
    });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    const requiredFields = ['code', 'name', 'manufacturer', 'model', 'type', 'location', 'acquisitionDate', 'estimatedLife', 'cost', 'serialNumber', 'status'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Validate unique fields
    const existingAsset = await prisma.asset.findFirst({
      where: {
        OR: [
          { code: req.body.code },
          { serialNumber: req.body.serialNumber }
        ]
      }
    });

    if (existingAsset) {
      return res.status(400).json({
        error: 'Asset with this code or serial number already exists',
        existingAsset
      });
    }

    const asset = await prisma.asset.create({
      data: {
        ...req.body,
        acquisitionDate: new Date(req.body.acquisitionDate),
        lastMaintenance: req.body.lastMaintenance ? new Date(req.body.lastMaintenance) : null,
        nextMaintenance: req.body.nextMaintenance ? new Date(req.body.nextMaintenance) : null,
      },
    });
    res.status(201).json(asset);
  } catch (error: any) {
    console.error('Error creating asset:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Unique constraint violation. Code or serial number already exists.' });
    } else {
      res.status(500).json({ 
        error: 'Failed to create asset',
        details: error.message
      });
    }
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const existingAsset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });
    if (!existingAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const updatedAsset = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedAsset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const existingAsset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });
    if (!existingAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await prisma.asset.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};
