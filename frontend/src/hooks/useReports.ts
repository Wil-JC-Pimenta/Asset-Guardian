import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Report {
  id: string;
  assetId: string;
  type: string;
  title: string;
  content: string;
  author: string;
  date: string;
  attachments: string[];
  status: string;
  version: number;
  asset: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.getReports();
      setReports(response);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar relatórios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (report: Omit<Report, 'id' | 'asset' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.createReport(report);
      setReports((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError('Erro ao criar relatório');
      throw err;
    }
  };

  const updateReport = async (id: string, report: Partial<Omit<Report, 'id' | 'asset'>>) => {
    try {
      const response = await api.updateReport(id, report);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...response } : r))
      );
      return response;
    } catch (err) {
      setError('Erro ao atualizar relatório');
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError('Erro ao excluir relatório');
      throw err;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    refreshReports: fetchReports,
  };
}; 