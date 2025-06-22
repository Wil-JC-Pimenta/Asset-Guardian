import { prisma } from '../config/database';
import { ReportType, ReportStatus } from '@prisma/client';

const reports = [
  {
    type: ReportType.MAINTENANCE,
    title: 'Relatório de Manutenção Preventiva - Q1 2024',
    content: 'Relatório detalhado das manutenções preventivas realizadas no primeiro trimestre de 2024.',
    author: 'João Silva',
    date: new Date('2024-03-31'),
    attachments: ['relatorio_q1_2024.pdf'],
    status: ReportStatus.PUBLISHED
  },
  {
    type: ReportType.INSPECTION,
    title: 'Inspeção de Equipamentos - Março 2024',
    content: 'Resultados das inspeções realizadas em todos os equipamentos críticos.',
    author: 'Maria Santos',
    date: new Date('2024-03-15'),
    attachments: ['inspecao_marco_2024.pdf'],
    status: ReportStatus.PUBLISHED
  },
  {
    type: ReportType.FAILURE,
    title: 'Análise de Falha - Sistema Hidráulico',
    content: 'Análise detalhada da falha ocorrida no sistema hidráulico do laminador.',
    author: 'Carlos Oliveira',
    date: new Date('2024-02-20'),
    attachments: ['analise_falha_hidraulico.pdf'],
    status: ReportStatus.DRAFT
  }
];

export const seedReports = async () => {
  try {
    console.log('🌱 Seeding reports...');
    
    // Get the first asset to associate with reports
    const asset = await prisma.asset.findFirst();
    
    if (!asset) {
      throw new Error('No assets found to associate with reports');
    }

    for (const report of reports) {
      await prisma.report.create({
        data: {
          ...report,
          assetId: asset.id
        }
      });
    }
    
    console.log('✅ Reports seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding reports:', error);
    throw error;
  }
}; 