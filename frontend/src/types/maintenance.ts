export interface MaintenanceRecord {
  id: string;
  assetId: string;
  asset: {
    id: string;
    name: string;
  };
  type: string;
  description: string;
  cost: number;
  date: string;
  status: string;
  responsible: string;
  deadline: string;
  materials: string;
  failureDetails?: string;
  solution?: string;
  attachments?: string;
  createdAt: string;
  updatedAt: string;
} 