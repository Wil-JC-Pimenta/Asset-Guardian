import { useState, useEffect } from 'react';
import { MaintenanceRecord } from '../services/api';
import { api } from '../services/api';

export const useMaintenance = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.getMaintenanceRecords();
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar registros de manutenção');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (record: Omit<MaintenanceRecord, 'id' | 'asset'>) => {
    try {
      const response = await api.createMaintenanceRecord(record);
      setRecords((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError('Erro ao criar registro de manutenção');
      throw err;
    }
  };

  const updateRecord = async (id: string, record: Partial<Omit<MaintenanceRecord, 'id' | 'asset'>>) => {
    try {
      const response = await api.updateMaintenanceRecord(id, record);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...response } : r))
      );
      return response;
    } catch (err) {
      setError('Erro ao atualizar registro de manutenção');
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await api.deleteMaintenanceRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError('Erro ao excluir registro de manutenção');
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    refreshRecords: fetchRecords,
  };
}; 