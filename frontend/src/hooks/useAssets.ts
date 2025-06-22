import { useState, useEffect } from 'react';
import { Asset } from '../services/api';
import { api } from '../services/api';

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.getAssets();
      setAssets(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar ativos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (asset: Omit<Asset, 'id'>) => {
    try {
      const response = await api.createAsset(asset);
      setAssets((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError('Erro ao criar ativo');
      throw err;
    }
  };

  const updateAsset = async (id: string, asset: Partial<Asset>) => {
    try {
      const response = await api.updateAsset(id, asset);
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...response } : a))
      );
      return response;
    } catch (err) {
      setError('Erro ao atualizar ativo');
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await api.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError('Erro ao excluir ativo');
      throw err;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    createAsset,
    updateAsset,
    deleteAsset,
    refreshAssets: fetchAssets,
  };
}; 