import { useState, useEffect } from 'react';
import { FMEARecord } from '../services/api';
import { api } from '../services/api';

export const useFMEA = () => {
  const [records, setRecords] = useState<FMEARecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.getFMEARecords();
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar registros de FMEA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (record: Omit<FMEARecord, 'id' | 'asset'>) => {
    try {
      const response = await api.createFMEARecord(record);
      setRecords((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError('Erro ao criar registro de FMEA');
      throw err;
    }
  };

  const updateRecord = async (id: string, record: Partial<Omit<FMEARecord, 'id' | 'asset'>>) => {
    try {
      const response = await api.updateFMEARecord(id, record);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...response } : r))
      );
      return response;
    } catch (err) {
      setError('Erro ao atualizar registro de FMEA');
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await api.deleteFMEARecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError('Erro ao excluir registro de FMEA');
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