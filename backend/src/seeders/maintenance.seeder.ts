import { AppDataSource } from '../config/database';
import { MaintenanceRecord } from '../entities/maintenance.entity';
import { Asset } from '../entities/asset.entity';

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
    const dataSource = await AppDataSource.initialize();
    const maintenanceRepository = dataSource.getRepository(MaintenanceRecord);
    const assetRepository = dataSource.getRepository(Asset);

    // Clear existing data
    await maintenanceRepository.clear();

    // Get all assets
    const assets = await assetRepository.find();

    // Insert new data
    for (const maintenance of maintenances) {
      // Assign a random asset to each maintenance
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      
      const newMaintenance = maintenanceRepository.create({
        ...maintenance,
        assetId: randomAsset.id
      });
      
      await maintenanceRepository.save(newMaintenance);
    }

    console.log('✅ Maintenances seeded successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding maintenances:', error);
    throw error;
  }
}; 