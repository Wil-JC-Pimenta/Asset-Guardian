import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getFMEARecords = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', assetId } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (assetId) {
      where.assetId = assetId as string;
    }

    const [records, total] = await Promise.all([
      prisma.fMEARecord.findMany({
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
      prisma.fMEARecord.count({ where }),
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
    console.error('Error fetching FMEA records:', error);
    res.status(500).json({ error: 'Failed to fetch FMEA records' });
  }
};

export const getFMEARecordById = async (req: Request, res: Response) => {
  try {
    const record = await prisma.fMEARecord.findUnique({
      where: { id: req.params.id },
      include: { asset: true },
    });

    if (!record) {
      return res.status(404).json({ error: 'FMEA record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching FMEA record:', error);
    res.status(500).json({ error: 'Failed to fetch FMEA record' });
  }
};

export const createFMEARecord = async (req: Request, res: Response) => {
  try {
    const { assetId, failureMode, effect, cause, severity, occurrence, detection, action, status } = req.body;
    
    // Calculate RPN
    const rpn = severity * occurrence * detection;

    const record = await prisma.fMEARecord.create({
      data: {
        assetId,
        failureMode,
        effect,
        cause,
        severity,
        occurrence,
        detection,
        rpn,
        action,
        status,
      },
      include: {
        asset: true,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating FMEA record:', error);
    res.status(500).json({ error: 'Failed to create FMEA record' });
  }
};

export const updateFMEARecord = async (req: Request, res: Response) => {
  try {
    const { severity, occurrence, detection, action, status } = req.body;
    
    // Recalculate RPN if any of the factors changed
    const rpn = severity * occurrence * detection;

    const record = await prisma.fMEARecord.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        rpn,
      },
      include: {
        asset: true,
      },
    });

    res.json(record);
  } catch (error) {
    console.error('Error updating FMEA record:', error);
    res.status(500).json({ error: 'Failed to update FMEA record' });
  }
};

export const deleteFMEARecord = async (req: Request, res: Response) => {
  try {
    await prisma.fMEARecord.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting FMEA record:', error);
    res.status(500).json({ error: 'Failed to delete FMEA record' });
  }
}; 