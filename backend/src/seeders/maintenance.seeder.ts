import { prisma } from '../config/database';

const maintenances = [
  {
    type: 'preventiva',
    description: 'Manutenção preventiva trimestral da tesoura guilhotina principal',
    cost: 2500.00,
    date: new Date('2024-05-15'),
    status: 'concluida',
    responsible: 'João Silva',
    deadline: new Date('2024-05-15'),
    materials: JSON.stringify(['Óleo hidráulico', 'Filtros']),
    failureDetails: 'Manutenção programada',
    solution: 'Manutenção preventiva realizada com sucesso',
    attachments: JSON.stringify(['relatorio_manutencao.pdf'])
  },
  {
    type: 'corretiva',
    description: 'Correção de vazamento no sistema hidráulico do laminador',
    cost: 5000.00,
    date: new Date('2024-06-08'),
    status: 'em_andamento',
    responsible: 'Maria Santos',
    deadline: new Date('2024-06-10'),
    materials: JSON.stringify(['Juntas', 'Selos hidráulicos']),
    failureDetails: 'Identificado vazamento no cilindro principal',
    solution: 'Em andamento',
    attachments: JSON.stringify(['foto_vazamento.jpg'])
  },
  {
    type: 'preditiva',
    description: 'Inspeção térmica e calibração do forno de recozimento',
    cost: 1500.00,
    date: new Date('2024-06-12'),
    status: 'agendada',
    responsible: 'Carlos Oliveira',
    deadline: new Date('2024-06-12'),
    materials: JSON.stringify(['Termovisor']),
    failureDetails: 'Agendada inspeção com termovisor',
    solution: 'Pendente',
    attachments: JSON.stringify([])
  }
];

export const seedMaintenances = async () => {
  try {
    console.log('🌱 Seeding maintenances...');
    
    // Get the first asset to associate with maintenances
    const asset = await prisma.asset.findFirst();
    
    if (!asset) {
      throw new Error('No assets found to associate with maintenances');
    }

    for (const maintenance of maintenances) {
      await prisma.maintenanceRecord.create({
        data: {
          ...maintenance,
          assetId: asset.id
        }
      });
    }
    
    console.log('✅ Maintenances seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding maintenances:', error);
    throw error;
  }
}; 