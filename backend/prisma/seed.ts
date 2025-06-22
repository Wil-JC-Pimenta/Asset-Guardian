import { PrismaClient, AssetType, AssetStatus, MaintenanceType, MaintenanceStatus, TechnicianSpecialty, TechnicianStatus, ReportType, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.fMEARecord.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.material.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.asset.deleteMany();

  console.log('🧹 Dados anteriores removidos');

  // Criar técnicos
  const technicians = await Promise.all([
    prisma.technician.create({
      data: {
        name: 'João Silva',
        email: 'joao.silva@empresa.com',
        phone: '(11) 99999-1111',
        specialty: TechnicianSpecialty.MECHANICAL,
        status: TechnicianStatus.ACTIVE,
        experience: 8,
        certifications: ['Técnico Mecânico', 'Soldador'],
        notes: 'Especialista em equipamentos pesados'
      }
    }),
    prisma.technician.create({
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@empresa.com',
        phone: '(11) 99999-2222',
        specialty: TechnicianSpecialty.ELECTRICAL,
        status: TechnicianStatus.ACTIVE,
        experience: 5,
        certifications: ['Técnico Eletrotécnico'],
        notes: 'Especialista em sistemas elétricos'
      }
    }),
    prisma.technician.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@empresa.com',
        phone: '(11) 99999-3333',
        specialty: TechnicianSpecialty.HYDRAULIC,
        status: TechnicianStatus.ACTIVE,
        experience: 6,
        certifications: ['Técnico Hidráulico'],
        notes: 'Especialista em sistemas hidráulicos'
      }
    })
  ]);

  console.log('👨‍🔧 Técnicos criados');

  // Criar materiais
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        code: 'MAT001',
        name: 'Óleo Hidráulico ISO 46',
        description: 'Óleo hidráulico para sistemas industriais',
        unit: 'Litro',
        quantity: 100,
        minQuantity: 20,
        cost: 25.50,
        supplier: 'Lubrificantes Ltda',
        location: 'Almoxarifado A',
        category: 'Lubrificantes',
        specifications: { viscosidade: 'ISO 46', temperatura: '-10°C a 80°C' }
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
        cost: 45.00,
        supplier: 'Filtros Industriais',
        location: 'Almoxarifado B',
        category: 'Filtros',
        specifications: { eficiencia: '99.9%', tamanho: '10" x 6"' }
      }
    }),
    prisma.material.create({
      data: {
        code: 'MAT003',
        name: 'Correia V',
        description: 'Correia V para motores elétricos',
        unit: 'Unidade',
        quantity: 30,
        minQuantity: 5,
        cost: 35.00,
        supplier: 'Correias Ltda',
        location: 'Almoxarifado A',
        category: 'Correias',
        specifications: { perfil: 'A', comprimento: '1000mm' }
      }
    })
  ]);

  console.log('📦 Materiais criados');

  // Criar 20 assets
  const assets = [];
  for (let i = 1; i <= 20; i++) {
    const asset = await prisma.asset.create({
      data: {
        code: `AST${i.toString().padStart(3, '0')}`,
        name: `Equipamento ${i}`,
        manufacturer: `Fabricante ${i % 3}`,
        model: `Modelo ${i % 4}`,
        type: [AssetType.MACHINE, AssetType.EQUIPMENT, AssetType.VEHICLE, AssetType.TOOL][i % 4],
        location: `Setor ${String.fromCharCode(65 + (i % 5))}`,
        acquisitionDate: new Date(2020, (i % 12), 1 + (i % 28)),
        estimatedLife: 36 + (i * 2),
        cost: 100000 + (i * 5000),
        serialNumber: `SN${i.toString().padStart(3, '0')}`,
        status: [AssetStatus.ACTIVE, AssetStatus.MAINTENANCE, AssetStatus.INACTIVE, AssetStatus.RETIRED][i % 4],
        description: `Descrição do equipamento ${i}`,
        specifications: { potencia: `${10 + i}kW`, peso: `${100 + i * 10}kg` },
        documents: [`https://docs.equip${i}.pdf`],
        images: [`https://img.equip${i}.jpg`],
        mtbf: 1000 + i * 10,
        mttr: 5 + i,
        oee: 85 + i * 0.5,
        availability: 95 - i * 0.5,
        performance: 90 + i * 0.2,
        quality: 99 - i * 0.1
      }
    });
    assets.push(asset);
  }

  // Criar registros de manutenção para os 3 primeiros assets
  await Promise.all([
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[0].id,
        type: MaintenanceType.PREVENTIVE,
        description: 'Manutenção preventiva trimestral',
        cost: 2500.00,
        date: new Date('2024-03-15'),
        status: MaintenanceStatus.SCHEDULED,
        responsible: technicians[0].name,
        deadline: new Date('2024-03-20'),
        materials: JSON.stringify([
          { materialId: materials[0].id, quantity: 2 },
          { materialId: materials[1].id, quantity: 1 }
        ]),
        attachments: ['https://relatorio1.pdf'],
        priority: 2,
        duration: 4,
        notes: 'Troca de óleo e filtro',
        technicianId: technicians[0].id
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[1].id,
        type: MaintenanceType.CORRECTIVE,
        description: 'Correção de falha no sistema hidráulico',
        cost: 5000.00,
        date: new Date('2024-03-10'),
        status: MaintenanceStatus.COMPLETED,
        responsible: technicians[1].name,
        deadline: new Date('2024-03-12'),
        materials: JSON.stringify([
          { materialId: materials[1].id, quantity: 1 }
        ]),
        failureDetails: 'Vazamento no sistema hidráulico',
        solution: 'Substituição da correia e ajuste do sistema',
        attachments: ['https://relatorio2.pdf'],
        priority: 1,
        duration: 6,
        notes: 'Urgente',
        technicianId: technicians[1].id
      }
    }),
    prisma.maintenanceRecord.create({
      data: {
        assetId: assets[2].id,
        type: MaintenanceType.PREDICTIVE,
        description: 'Análise preditiva do sistema elétrico',
        cost: 1800.00,
        date: new Date('2024-03-05'),
        status: MaintenanceStatus.IN_PROGRESS,
        responsible: technicians[0].name,
        deadline: new Date('2024-03-08'),
        materials: JSON.stringify([]),
        attachments: [],
        priority: 3,
        duration: 2,
        notes: 'Monitoramento de vibração',
        technicianId: technicians[0].id
      }
    })
  ]);

  // Criar registros FMEA para os 3 primeiros assets
  await Promise.all([
    prisma.fMEARecord.create({
      data: {
        assetId: assets[0].id,
        failureMode: 'Vazamento de óleo',
        potentialEffect: 'Contaminação do ambiente e perda de lubrificação',
        severity: 7,
        occurrence: 3,
        detection: 4,
        rpn: 84,
        recommendedAction: 'Implementar inspeção visual diária',
        responsible: 'João Silva',
        status: 'Em análise',
        implementationDate: new Date('2024-04-01'),
        effectiveness: 'Aguardando'
      }
    }),
    prisma.fMEARecord.create({
      data: {
        assetId: assets[1].id,
        failureMode: 'Falha no sistema de refrigeração',
        potentialEffect: 'Superaquecimento e danos aos componentes',
        severity: 8,
        occurrence: 2,
        detection: 3,
        rpn: 48,
        recommendedAction: 'Limpeza preventiva mensal',
        responsible: 'Maria Santos',
        status: 'Implementado',
        implementationDate: new Date('2024-04-10'),
        effectiveness: 'Eficaz'
      }
    }),
    prisma.fMEARecord.create({
      data: {
        assetId: assets[2].id,
        failureMode: 'Falha na bateria',
        potentialEffect: 'Parada operacional',
        severity: 6,
        occurrence: 4,
        detection: 5,
        rpn: 120,
        recommendedAction: 'Substituição preventiva a cada 2 anos',
        responsible: 'João Silva',
        status: 'Em análise',
        implementationDate: new Date('2024-05-01'),
        effectiveness: 'Aguardando'
      }
    })
  ]);

  // Criar relatórios para os 3 primeiros assets
  await Promise.all([
    prisma.report.create({
      data: {
        assetId: assets[0].id,
        type: ReportType.MAINTENANCE,
        title: 'Relatório de Manutenção',
        content: 'Manutenção preventiva realizada com sucesso.',
        author: 'João Silva',
        date: new Date('2024-03-21'),
        attachments: ['https://relatorio1.pdf'],
        status: ReportStatus.PUBLISHED,
        version: 1
      }
    }),
    prisma.report.create({
      data: {
        assetId: assets[1].id,
        type: ReportType.FAILURE,
        title: 'Falha no sistema hidráulico',
        content: 'Falha corrigida após troca de componentes.',
        author: 'Maria Santos',
        date: new Date('2024-03-13'),
        attachments: ['https://relatorio2.pdf'],
        status: ReportStatus.PUBLISHED,
        version: 1
      }
    })
  ]);

  // Criar logs de auditoria
  await prisma.auditLog.create({
    data: {
      table: 'Asset',
      action: 'CREATE',
      recordId: assets[0].id,
      newValues: {
        code: assets[0].code,
        name: assets[0].name,
        manufacturer: assets[0].manufacturer,
        model: assets[0].model,
        type: assets[0].type,
        location: assets[0].location,
        acquisitionDate: assets[0].acquisitionDate,
        estimatedLife: assets[0].estimatedLife,
        cost: assets[0].cost,
        serialNumber: assets[0].serialNumber,
        status: assets[0].status
      },
      userId: 'admin',
      timestamp: new Date()
    }
  });

  console.log('✅ Seed atualizado e populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 