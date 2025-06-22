import { prisma } from '../config/database';
import { MaintenanceType, MaintenanceStatus } from '@prisma/client';

const maintenances = [
  {
    assetCode: 'EQP001',
    type: MaintenanceType.PREVENTIVE,
    description: 'Manutenção preventiva trimestral da tesoura guilhotina principal',
    cost: 2500.00,
    date: new Date('2024-05-15'),
    status: MaintenanceStatus.COMPLETED,
    responsible: 'João Silva',
    deadline: new Date('2024-05-15'),
    materials: ['Óleo hidráulico', 'Filtros'],
    failureDetails: 'Manutenção programada',
    solution: 'Manutenção preventiva realizada com sucesso',
    attachments: ['relatorio_manutencao.pdf']
  },
  {
    assetCode: 'EQP002',
    type: MaintenanceType.CORRECTIVE,
    description: 'Correção de vazamento no sistema hidráulico do laminador',
    cost: 5000.00,
    date: new Date('2024-06-01'),
    status: MaintenanceStatus.COMPLETED,
    responsible: 'Maria Santos',
    deadline: new Date('2024-06-02'),
    materials: ['Termovisor'],
    failureDetails: 'Vazamento detectado durante inspeção',
    solution: 'Troca de vedação e reaperto das conexões',
    attachments: ['foto_vazamento.jpg']
  },
  {
    assetCode: 'EQP003',
    type: MaintenanceType.PREVENTIVE,
    description: 'Lubrificação geral do sistema de transporte',
    cost: 1500.00,
    date: new Date('2024-06-10'),
    status: MaintenanceStatus.SCHEDULED,
    responsible: 'Carlos Souza',
    deadline: new Date('2024-06-15'),
    materials: ['Graxa', 'Pano'],
    failureDetails: 'Manutenção preventiva programada',
    solution: '',
    attachments: []
  }
];

export async function seedMaintenances() {
  console.log('🌱 Seeding maintenances...');
  for (const maintenance of maintenances) {
    const asset = await prisma.asset.findUnique({ where: { code: maintenance.assetCode } });
    if (!asset) {
      throw new Error(`Asset with code ${maintenance.assetCode} not found`);
    }
    const { assetCode, ...maintenanceData } = maintenance;
    await prisma.maintenanceRecord.create({
      data: {
        ...maintenanceData,
        assetId: asset.id,
        materials: maintenanceData.materials as any,
        attachments: maintenanceData.attachments as string[]
      }
    });
  }
  console.log('✅ Maintenances seeded successfully');
} 