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
    const asset = await prisma.asset.create({
      data: req.body,
    });
    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
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
