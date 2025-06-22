import { PrismaClient } from '@prisma/client';
import { AssetService } from '../services/asset.service';

const prisma = new PrismaClient();
const assetService = new AssetService();

describe('Asset Service', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.asset.deleteMany();
  });

  it('should create a new asset', async () => {
    const assetData = {
      code: 'TEST001',
      name: 'Test Asset',
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      type: 'equipamento',
      location: 'Test Location',
      acquisitionDate: new Date(),
      estimatedLife: 120,
      cost: 100000,
      serialNumber: 'TEST123',
      status: 'ativo'
    };

    const asset = await assetService.createAsset(assetData);

    expect(asset).toBeDefined();
    expect(asset.code).toBe(assetData.code);
    expect(asset.name).toBe(assetData.name);
  });

  it('should get all assets', async () => {
    const assets = await assetService.getAllAssets();
    expect(Array.isArray(assets)).toBe(true);
  });

  it('should get asset by id', async () => {
    const assetData = {
      code: 'TEST002',
      name: 'Test Asset 2',
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      type: 'equipamento',
      location: 'Test Location',
      acquisitionDate: new Date(),
      estimatedLife: 120,
      cost: 100000,
      serialNumber: 'TEST456',
      status: 'ativo'
    };

    const createdAsset = await assetService.createAsset(assetData);
    const asset = await assetService.getAssetById(createdAsset.id);

    expect(asset).toBeDefined();
    expect(asset?.id).toBe(createdAsset.id);
  });

  it('should update an asset', async () => {
    const assetData = {
      code: 'TEST003',
      name: 'Test Asset 3',
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      type: 'equipamento',
      location: 'Test Location',
      acquisitionDate: new Date(),
      estimatedLife: 120,
      cost: 100000,
      serialNumber: 'TEST789',
      status: 'ativo'
    };

    const createdAsset = await assetService.createAsset(assetData);
    const updatedAsset = await assetService.updateAsset(createdAsset.id, {
      name: 'Updated Asset Name'
    });

    expect(updatedAsset).toBeDefined();
    expect(updatedAsset?.name).toBe('Updated Asset Name');
  });

  it('should delete an asset', async () => {
    const assetData = {
      code: 'TEST004',
      name: 'Test Asset 4',
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      type: 'equipamento',
      location: 'Test Location',
      acquisitionDate: new Date(),
      estimatedLife: 120,
      cost: 100000,
      serialNumber: 'TEST012',
      status: 'ativo'
    };

    const createdAsset = await assetService.createAsset(assetData);
    const deletedAsset = await assetService.deleteAsset(createdAsset.id);

    expect(deletedAsset).toBeDefined();
    expect(deletedAsset?.id).toBe(createdAsset.id);

    const asset = await assetService.getAssetById(createdAsset.id);
    expect(asset).toBeNull();
  });
}); 