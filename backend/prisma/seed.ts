import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar tipos de ativos
  const assetTypes = ['Máquina', 'Equipamento', 'Veículo', 'Ferramenta'];
  const assetStatus = ['Ativo', 'Inativo', 'Em Manutenção', 'Aposentado'];
  const maintenanceTypes = ['preventive', 'corrective', 'predictive', 'emergency'];
  const maintenanceStatus = ['scheduled', 'in_progress', 'completed', 'cancelled'];
  const technicianStatus = ['active', 'inactive', 'on_leave'];
  const technicianSpecialties = ['Mecânica', 'Elétrica', 'Hidráulica', 'Pneumática', 'Eletrônica'];

  // Criar técnicos
  const technicians = await Promise.all([
    prisma.technician.create({
      data: {
        name: 'João Silva',
        email: 'joao.silva@empresa.com',
        phone: '(11) 98765-4321',
        specialty: technicianSpecialties[0],
        status: technicianStatus[0]
      }
    }),
    prisma.technician.create({
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@empresa.com',
        phone: '(11) 98765-4322',
        specialty: technicianSpecialties[1],
        status: technicianStatus[0]
      }
    }),
    prisma.technician.create({
      data: {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@empresa.com',
        phone: '(11) 98765-4323',
        specialty: technicianSpecialties[2],
        status: technicianStatus[0]
      }
    })
  ]);

  // Criar materiais
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        code: 'MAT001',
        name: 'Óleo Lubrificante',
        description: 'Óleo lubrificante para máquinas industriais',
        unit: 'Litro',
        quantity: 100,
        minQuantity: 20,
        cost: 45.90,
        supplier: 'Fornecedor A',
        location: 'Almoxarifado 1'
      }
    }),
    prisma.material.create({
      data: {
        code: 'MAT002',
        name: 'Filtro de Ar',
        description: 'Filtro de ar para compressores',
        unit: 'Unidade',
        quantity: 50,
        minQuantity: 10,
        cost: 89.90,
        supplier: 'Fornecedor B',
        location: 'Almoxarifado 2'
      }
    }),
    prisma.material.create({
      data: {
        code: 'MAT003',
        name: 'Correia Industrial',
        description: 'Correia para motores industriais',
        unit: 'Unidade',
        quantity: 30,
        minQuantity: 5,
        cost: 120.00,
        supplier: 'Fornecedor C',
        location: 'Almoxarifado 1'
      }
    })
  ]);

  // Criar ativos
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        code: 'AST001',
        name: 'Compressor Industrial',
        manufacturer: 'Atlas Copco',
        model: 'GA 75',
        type: assetTypes[0],
        location: 'Setor A',
        acquisitionDate: new Date('2020-01-15'),
        estimatedLife: 60,
        cost: 150000.00,
        serialNumber: 'SN001',
        status: assetStatus[0]
      }
    }),
    prisma.asset.create({
      data: {
        code: 'AST002',
        name: 'Máquina de Corte CNC',
        manufacturer: 'Mazak',
        model: 'VTC-800',
        type: assetTypes[0],
        location: 'Setor B',
        acquisitionDate: new Date('2019-06-20'),
        estimatedLife: 72,
        cost: 450000.00,
        serialNumber: 'SN002',
        status: assetStatus[0]
      }
    }),
    prisma.asset.create({
      data: {
        code: 'AST003',
        name: 'Empilhadeira Elétrica',
        manufacturer: 'Toyota',
        model: 'BT Reflex',
        type: assetTypes[2],
        location: 'Setor C',
        acquisitionDate: new Date('2021-03-10'),
        estimatedLife: 48,
        cost: 180000.00,
        serialNumber: 'SN003',
        status: assetStatus[0]
      }
    })
  ]);

  // Criar registros de manutenção
  const maintenanceRecords = await Promise.all([
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[0].id,
        type: maintenanceTypes[0],
        description: 'Manutenção preventiva trimestral',
        cost: 2500.00,
        date: new Date('2024-03-15'),
        status: maintenanceStatus[0],
        responsible: technicians[0].name,
        deadline: new Date('2024-03-20'),
        materials: JSON.stringify([
          { id: materials[0].id, quantity: 2 },
          { id: materials[1].id, quantity: 1 }
        ])
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[1].id,
        type: maintenanceTypes[1],
        description: 'Correção de falha no sistema hidráulico',
        cost: 5000.00,
        date: new Date('2024-03-10'),
        status: maintenanceStatus[2],
        responsible: technicians[1].name,
        deadline: new Date('2024-03-12'),
        materials: JSON.stringify([
          { id: materials[2].id, quantity: 1 }
        ]),
        failureDetails: 'Vazamento no sistema hidráulico',
        solution: 'Substituição da correia e ajuste do sistema'
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[2].id,
        type: maintenanceTypes[2],
        description: 'Análise preditiva do sistema elétrico',
        cost: 1800.00,
        date: new Date('2024-03-05'),
        status: maintenanceStatus[1],
        responsible: technicians[2].name,
        deadline: new Date('2024-03-08'),
        materials: JSON.stringify([])
      }
    })
  ]);

  // Criar registros FMEA
  const fmeaRecords = await Promise.all([
    prisma.fmeaRecord.create({
      data: {
        assetId: assets[0].id,
        failureMode: 'Vazamento de óleo',
        effect: 'Contaminação do ambiente e perda de lubrificação',
        cause: 'Desgaste do selo',
        severity: 7,
        occurrence: 3,
        detection: 4,
        rpn: 84,
        action: 'Implementar inspeção visual diária',
        status: 'Em análise'
      }
    }),
    prisma.fmeaRecord.create({
      data: {
        assetId: assets[1].id,
        failureMode: 'Falha no sistema de refrigeração',
        effect: 'Superaquecimento e danos aos componentes',
        cause: 'Acúmulo de sujeira no radiador',
        severity: 8,
        occurrence: 2,
        detection: 3,
        rpn: 48,
        action: 'Limpeza preventiva mensal',
        status: 'Implementado'
      }
    }),
    prisma.fmeaRecord.create({
      data: {
        assetId: assets[2].id,
        failureMode: 'Falha na bateria',
        effect: 'Parada operacional',
        cause: 'Envelhecimento natural',
        severity: 6,
        occurrence: 4,
        detection: 5,
        rpn: 120,
        action: 'Substituição preventiva a cada 2 anos',
        status: 'Em análise'
      }
    })
  ]);

  console.log('Dados de seed criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 