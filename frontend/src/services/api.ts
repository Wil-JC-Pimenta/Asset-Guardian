const API_BASE_URL = '/api';

// Tipos de erro personalizados
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Interfaces
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
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface FMEARecord {
  id: string;
  assetId: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  action: string;
  status: string;
  asset: {
    id: string;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Função auxiliar para tratamento de erros
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error
    });
    throw new APIError(
      error.message || 'An error occurred',
      response.status,
      error.code
    );
  }
  return response.json();
};

// Função auxiliar para fazer requisições
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    throw error;
  }
};

export const api = {
  // Asset endpoints
  getAssets: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    status?: string;
    type?: string;
  }): Promise<PaginatedResponse<Asset>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets?${queryParams}`);
    return handleResponse<PaginatedResponse<Asset>>(response);
  },

  getAssetById: async (id: string): Promise<Asset> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/${id}`);
    return handleResponse<Asset>(response);
  },

  createAsset: async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets`, {
      method: 'POST',
      body: JSON.stringify(asset)
    });
    return handleResponse<Asset>(response);
  },

  updateAsset: async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(asset)
    });
    return handleResponse<Asset>(response);
  },

  deleteAsset: async (id: string): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  },

  // Maintenance endpoints
  getMaintenanceRecords: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    assetId?: string;
    type?: string;
    status?: string;
  }): Promise<PaginatedResponse<MaintenanceRecord>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await fetchWithTimeout(`${API_BASE_URL}/maintenance?${queryParams}`);
    return handleResponse<PaginatedResponse<MaintenanceRecord>>(response);
  },

  getMaintenanceRecordById: async (id: string): Promise<MaintenanceRecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/maintenance/${id}`);
    return handleResponse<MaintenanceRecord>(response);
  },

  createMaintenanceRecord: async (
    record: Omit<MaintenanceRecord, 'id' | 'asset'>
  ): Promise<MaintenanceRecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(record)
    });
    return handleResponse<MaintenanceRecord>(response);
  },

  updateMaintenanceRecord: async (
    id: string,
    record: Partial<Omit<MaintenanceRecord, 'id' | 'asset'>>
  ): Promise<MaintenanceRecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    });
    return handleResponse<MaintenanceRecord>(response);
  },

  deleteMaintenanceRecord: async (id: string): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  },

  // FMEA endpoints
  getFMEARecords: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    assetId?: string;
    status?: string;
  }): Promise<PaginatedResponse<FMEARecord>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await fetchWithTimeout(`${API_BASE_URL}/fmea?${queryParams}`);
    return handleResponse<PaginatedResponse<FMEARecord>>(response);
  },

  getFMEARecordById: async (id: string): Promise<FMEARecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/fmea/${id}`);
    return handleResponse<FMEARecord>(response);
  },

  createFMEARecord: async (record: Omit<FMEARecord, 'id' | 'asset'>): Promise<FMEARecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/fmea`, {
      method: 'POST',
      body: JSON.stringify(record)
    });
    return handleResponse<FMEARecord>(response);
  },

  updateFMEARecord: async (
    id: string,
    record: Partial<Omit<FMEARecord, 'id' | 'asset'>>
  ): Promise<FMEARecord> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/fmea/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    });
    return handleResponse<FMEARecord>(response);
  },

  deleteFMEARecord: async (id: string): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/fmea/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  }
}; 