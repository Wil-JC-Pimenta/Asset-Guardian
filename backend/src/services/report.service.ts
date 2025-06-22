import { PrismaClient } from '@prisma/client';
import { Report } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  async getAllReports(): Promise<Report[]> {
    return prisma.report.findMany({
      include: {
        asset: true,
      },
    });
  }

  async getReportById(id: string): Promise<Report | null> {
    return prisma.report.findUnique({
      where: { id },
      include: {
        asset: true,
      },
    });
  }

  async createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    return prisma.report.create({
      data,
      include: {
        asset: true,
      },
    });
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    return prisma.report.update({
      where: { id },
      data,
      include: {
        asset: true,
      },
    });
  }

  async deleteReport(id: string): Promise<Report> {
    return prisma.report.delete({
      where: { id },
      include: {
        asset: true,
      },
    });
  }
} 