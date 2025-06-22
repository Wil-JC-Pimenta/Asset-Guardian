import { AssetType, AssetStatus, MaintenanceType, MaintenanceStatus, TechnicianStatus, TechnicianSpecialty, ReportType, ReportStatus } from '@prisma/client';

// Tipos base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para Assets
export interface AssetCreateInput {
  code: string;
  name: string;
  manufacturer: string;
  model: string;
  type: AssetType;
  location: string;
  acquisitionDate: Date;
  estimatedLife: number;
  cost: number;
  serialNumber: string;
  status?: AssetStatus;
  description?: string;
  specifications?: Record<string, any>;
  documents?: string[];
  images?: string[];
}

export interface AssetUpdateInput extends Partial<AssetCreateInput> {
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  mtbf?: number;
  mttr?: number;
  oee?: number;
  availability?: number;
  performance?: number;
  quality?: number;
}

export interface AssetFilters {
  search?: string;
  type?: AssetType;
  status?: AssetStatus;
  location?: string;
  manufacturer?: string;
  minCost?: number;
  maxCost?: number;
}

// Tipos para Maintenance Records
export interface MaintenanceCreateInput {
  assetId: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  date: Date;
  status?: MaintenanceStatus;
  responsible: string;
  deadline: Date;
  materials: Array<{
    materialId: string;
    quantity: number;
    cost?: number;
  }>;
  failureDetails?: string;
  solution?: string;
  attachments?: string[];
  priority?: number;
  duration?: number;
  notes?: string;
  technicianId?: string;
}

export interface MaintenanceUpdateInput extends Partial<MaintenanceCreateInput> {}

export interface MaintenanceFilters {
  assetId?: string;
  type?: MaintenanceType;
  status?: MaintenanceStatus;
  dateFrom?: Date;
  dateTo?: Date;
  responsible?: string;
  technicianId?: string;
}

// Tipos para Technicians
export interface TechnicianCreateInput {
  name: string;
  email: string;
  phone?: string;
  specialty: TechnicianSpecialty;
  status?: TechnicianStatus;
  experience?: number;
  certifications?: string[];
  notes?: string;
}

export interface TechnicianUpdateInput extends Partial<TechnicianCreateInput> {}

// Tipos para Materials
export interface MaterialCreateInput {
  code: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  supplier?: string;
  location?: string;
  category?: string;
  specifications?: Record<string, any>;
}

export interface MaterialUpdateInput extends Partial<MaterialCreateInput> {}

// Tipos para FMEA Records
export interface FMEACreateInput {
  assetId: string;
  failureMode: string;
  potentialEffect: string;
  severity: number;
  occurrence: number;
  detection: number;
  recommendedAction: string;
  responsible: string;
  status: string;
  implementationDate?: Date;
  effectiveness?: string;
}

export interface FMEAUpdateInput extends Partial<FMEACreateInput> {}

// Tipos para Reports
export interface ReportCreateInput {
  assetId: string;
  type: ReportType;
  title: string;
  content: string;
  author: string;
  date: Date;
  attachments?: string[];
  status?: ReportStatus;
  version?: number;
}

export interface ReportUpdateInput extends Partial<ReportCreateInput> {}

// Tipos para paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: any;
}

// Tipos para auditoria
export interface AuditLogCreateInput {
  table: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  recordId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  userId?: string;
}

// Tipos para métricas e KPIs
export interface AssetMetrics {
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
  totalValue: number;
  averageAge: number;
  availabilityRate: number;
  oeeAverage: number;
}

export interface MaintenanceMetrics {
  totalMaintenance: number;
  completedMaintenance: number;
  scheduledMaintenance: number;
  overdueMaintenance: number;
  totalCost: number;
  averageCost: number;
  averageDuration: number;
}

// Tipos para filtros avançados
export interface AdvancedFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  costRange?: {
    min: number;
    max: number;
  };
  performanceRange?: {
    min: number;
    max: number;
  };
  statuses?: string[];
  types?: string[];
  locations?: string[];
} 