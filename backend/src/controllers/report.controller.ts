import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getReports = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', assetId, type, status } = req.query;
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

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
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
      prisma.report.count({ where }),
    ]);

    res.json({
      data: reports,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { asset: true },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.create({
      data: req.body,
      include: { asset: true },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const existingReport = await prisma.report.findUnique({
      where: { id: req.params.id },
    });
    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const updatedReport = await prisma.report.update({
      where: { id: req.params.id },
      data: req.body,
      include: { asset: true },
    });
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const existingReport = await prisma.report.findUnique({
      where: { id: req.params.id },
    });
    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await prisma.report.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
}; 