import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { api } from '../../services/api';

// Mock da API
jest.mock('../../services/api', () => ({
  api: {
    getAssets: jest.fn(),
    getMaintenanceRecords: jest.fn(),
  },
}));

describe('Dashboard Component', () => {
  const mockAssets = [
    {
      id: '1',
      code: 'EQP001',
      name: 'Test Asset 1',
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      type: 'equipamento',
      location: 'Test Location',
      acquisitionDate: new Date(),
      estimatedLife: 120,
      cost: 100000,
      serialNumber: 'TEST123',
      status: 'ativo',
      lastMaintenance: null,
      nextMaintenance: null,
      mtbf: null,
      mttr: null,
      oee: null,
      availability: null,
      performance: null,
      quality: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockMaintenanceRecords = [
    {
      id: '1',
      assetId: '1',
      type: 'preventiva',
      description: 'Test Maintenance',
      cost: 1000,
      date: new Date(),
      status: 'concluida',
      responsible: 'Test User',
      deadline: new Date(),
      materials: 'Test Materials',
      failureDetails: null,
      solution: null,
      attachments: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Configurar os mocks para retornar dados de teste
    (api.getAssets as jest.Mock).mockResolvedValue({ data: mockAssets });
    (api.getMaintenanceRecords as jest.Mock).mockResolvedValue({ data: mockMaintenanceRecords });
  });

  it('should render loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render dashboard data after loading', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Verificar se os KPIs estão sendo exibidos
    expect(screen.getByText('Total de Ativos')).toBeInTheDocument();
    expect(screen.getByText('Ativos Operacionais')).toBeInTheDocument();
    expect(screen.getByText('Em Manutenção')).toBeInTheDocument();
    expect(screen.getByText('Custo Total de Manutenção')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Simular erro na API
    (api.getAssets as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados do dashboard')).toBeInTheDocument();
    });
  });
}); 