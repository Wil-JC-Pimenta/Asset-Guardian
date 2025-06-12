import { AppDataSource } from '../config/database';
import { Asset } from '../entities/asset.entity';

const assets = [
  {
    code: 'TG-001',
    name: 'Tesoura Guilhotina Principal',
    manufacturer: 'MetalTech',
    model: 'MT-2000',
    type: 'Equipamento de Corte',
    location: 'Linha de Produção 1',
    acquisitionDate: new Date('2023-01-15'),
    estimatedLife: 120,
    cost: 249999.99,
    serialNumber: 'SN-TG-2023-001',
    status: 'Operacional',
    lastMaintenance: new Date('2024-05-15'),
    nextMaintenance: new Date('2024-06-15')
  },
  {
    code: 'LP-002',
    name: 'Laminador de Bobinas',
    manufacturer: 'RollTech',
    model: 'RT-5000',
    type: 'Equipamento de Laminação',
    location: 'Linha de Produção 2',
    acquisitionDate: new Date('2023-02-20'),
    estimatedLife: 180,
    cost: 1899999.99,
    serialNumber: 'SN-LP-2023-002',
    status: 'Em Manutenção',
    lastMaintenance: new Date('2024-06-08'),
    nextMaintenance: new Date('2024-07-08')
  },
  {
    code: 'FR-003',
    name: 'Forno de Recozimento',
    manufacturer: 'HeatTech',
    model: 'HT-3000',
    type: 'Equipamento Térmico',
    location: 'Área de Tratamento Térmico',
    acquisitionDate: new Date('2023-03-10'),
    estimatedLife: 144,
    cost: 999999.99,
    serialNumber: 'SN-FR-2023-003',
    status: 'Atenção',
    lastMaintenance: new Date('2024-05-28'),
    nextMaintenance: new Date('2024-06-12')
  },
  {
    code: 'BH-101',
    name: 'Bomba Hidráulica Principal',
    manufacturer: 'HydraTech',
    model: 'HT-1000',
    type: 'Sistema Hidráulico',
    location: 'Casa de Bombas',
    acquisitionDate: new Date('2023-01-05'),
    estimatedLife: 120,
    cost: 29999.99,
    serialNumber: 'SN-BH-2023-001',
    status: 'Operacional',
    lastMaintenance: new Date('2024-05-20'),
    nextMaintenance: new Date('2024-06-20')
  },
  {
    code: 'PH-201',
    name: 'Prensa Hidráulica',
    manufacturer: 'HydraTech',
    model: 'HT-2000',
    type: 'Equipamento de Conformação',
    location: 'Área de Conformação',
    acquisitionDate: new Date('2023-02-01'),
    estimatedLife: 120,
    cost: 899999.99,
    serialNumber: 'SN-PH-2023-001',
    status: 'Operacional',
    lastMaintenance: new Date('2024-05-10'),
    nextMaintenance: new Date('2024-06-10')
  },
  {
    code: 'MI-301',
    name: 'Misturador Industrial',
    manufacturer: 'MixTech',
    model: 'MT-3000',
    type: 'Equipamento de Processamento',
    location: 'Área de Processamento',
    acquisitionDate: new Date('2023-03-15'),
    estimatedLife: 120,
    cost: 109999.99,
    serialNumber: 'SN-MI-2023-001',
    status: 'Operacional',
    lastMaintenance: new Date('2024-05-25'),
    nextMaintenance: new Date('2024-06-25')
  },
  {
    code: 'CA-401',
    name: 'Compressor de Ar',
    manufacturer: 'AirTech',
    model: 'AT-4000',
    type: 'Sistema de Ar Comprimido',
    location: 'Sala de Compressores',
    acquisitionDate: new Date('2022-12-10'),
    estimatedLife: 120,
    cost: 129999.99,
    serialNumber: 'SN-CA-2022-001',
    status: 'Inativo',
    lastMaintenance: new Date('2024-04-15'),
    nextMaintenance: new Date('2024-05-15')
  },
  {
    code: 'SR-501',
    name: 'Sistema de Refrigeração',
    manufacturer: 'CoolTech',
    model: 'CT-5000',
    type: 'Sistema de Climatização',
    location: 'Sala de Máquinas',
    acquisitionDate: new Date('2023-02-28'),
    estimatedLife: 120,
    cost: 399999.99,
    serialNumber: 'SN-SR-2023-001',
    status: 'Operacional',
    lastMaintenance: new Date('2024-05-18'),
    nextMaintenance: new Date('2024-06-18')
  }
];

export const seedAssets = async () => {
  try {
    const dataSource = await AppDataSource.initialize();
    const assetRepository = dataSource.getRepository(Asset);

    // Clear existing data with CASCADE
    await dataSource.query('TRUNCATE TABLE maintenances CASCADE');
    await dataSource.query('TRUNCATE TABLE assets CASCADE');

    // Insert new data
    for (const asset of assets) {
      const newAsset = assetRepository.create(asset);
      await assetRepository.save(newAsset);
    }

    console.log('✅ Assets seeded successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding assets:', error);
    throw error;
  }
}; 