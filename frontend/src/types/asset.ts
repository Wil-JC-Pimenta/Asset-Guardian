export interface Asset {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  location: string;
  acquisitionDate: string;
  estimatedLife: number;
  cost: number;
  serialNumber: string;
  status: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  mtbf: number;
  mttr: number;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  createdAt: string;
  updatedAt: string;
} 