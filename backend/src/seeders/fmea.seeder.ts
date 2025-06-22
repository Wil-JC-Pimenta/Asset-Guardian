import { prisma } from '../config/database';

const fmeaRecords = [
  {
    failureMode: 'Desgaste excessivo das lâminas',
    potentialEffect: 'Corte irregular e perda de qualidade do produto',
    severity: 8,
    occurrence: 6,
    detection: 7,
    rpn: 336,
    recommendedAction: 'Implementar programa de troca preventiva de lâminas',
    responsible: 'João Silva',
    status: 'Em análise'
  },
  {
    failureMode: 'Vazamento no sistema hidráulico',
    potentialEffect: 'Perda de pressão e parada não programada',
    severity: 7,
    occurrence: 4,
    detection: 8,
    rpn: 224,
    recommendedAction: 'Inspeção mensal do sistema hidráulico',
    responsible: 'Maria Santos',
    status: 'Implementado'
  },
  {
    failureMode: 'Falha no sistema de controle',
    potentialEffect: 'Operação fora dos parâmetros especificados',
    severity: 9,
    occurrence: 3,
    detection: 6,
    rpn: 162,
    recommendedAction: 'Calibração trimestral do sistema de controle',
    responsible: 'Carlos Oliveira',
    status: 'Pendente'
  }
];

export const seedFMEA = async () => {
  try {
    console.log('🌱 Seeding FMEA records...');
    
    // Get the first asset to associate with FMEA records
    const asset = await prisma.asset.findFirst();
    
    if (!asset) {
      throw new Error('No assets found to associate with FMEA records');
    }

    for (const fmeaRecord of fmeaRecords) {
      await prisma.fMEARecord.create({
        data: {
          ...fmeaRecord,
          assetId: asset.id
        }
      });
    }
    
    console.log('✅ FMEA records seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding FMEA records:', error);
    throw error;
  }
}; 