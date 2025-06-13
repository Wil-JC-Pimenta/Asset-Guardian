import { prisma } from '../config/database';

const assets = [
  {
    code: 'EQP001',
    name: 'Tesoura Guilhotina Principal',
    manufacturer: 'MetalMax',
    model: 'TG-2000',
    type: 'equipamento',
    location: 'Setor de Corte',
    acquisitionDate: new Date('2023-01-15'),
    estimatedLife: 120,
    cost: 150000.00,
    serialNumber: 'TG2023001',
    status: 'ativo'
  },
  {
    code: 'EQP002',
    name: 'Laminador Contínuo',
    manufacturer: 'SteelTech',
    model: 'LC-5000',
    type: 'equipamento',
    location: 'Setor de Laminação',
    acquisitionDate: new Date('2023-03-20'),
    estimatedLife: 180,
    cost: 250000.00,
    serialNumber: 'LC2023001',
    status: 'ativo'
  },
  {
    code: 'EQP003',
    name: 'Forno de Recozimento',
    manufacturer: 'HeatMaster',
    model: 'FR-3000',
    type: 'equipamento',
    location: 'Setor de Tratamento Térmico',
    acquisitionDate: new Date('2023-06-10'),
    estimatedLife: 144,
    cost: 180000.00,
    serialNumber: 'FR2023001',
    status: 'ativo'
  }
];

export const seedAssets = async () => {
  try {
    console.log('🌱 Seeding assets...');
    
    for (const asset of assets) {
      await prisma.asset.upsert({
        where: { code: asset.code },
        update: {},
        create: asset
      });
    }
    
    console.log('✅ Assets seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding assets:', error);
    throw error;
  }
}; 