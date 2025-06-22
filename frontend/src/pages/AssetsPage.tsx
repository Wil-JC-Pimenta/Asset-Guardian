import React, { useState } from 'react';
import { useAssets } from '../hooks/useAssets';
import { AssetTable } from '../components/tables/AssetTable';
import { AssetForm } from '../components/forms/AssetForm';
import { Asset } from '../types/asset';

export const AssetsPage: React.FC = () => {
  const { assets, loading, error, createAsset, updateAsset, deleteAsset } = useAssets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleCreate = async (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createAsset(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao criar ativo:', err);
    }
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedAsset) return;
    try {
      await updateAsset(selectedAsset.id, data);
      setIsModalOpen(false);
      setSelectedAsset(null);
    } catch (err) {
      console.error('Erro ao atualizar ativo:', err);
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (window.confirm('Tem certeza que deseja excluir este ativo?')) {
      try {
        await deleteAsset(asset.id);
      } catch (err) {
        console.error('Erro ao excluir ativo:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Ativos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os ativos do sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedAsset(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Adicionar Ativo
          </button>
        </div>
      </div>

      <div className="mt-8">
        <AssetTable assets={assets} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedAsset ? 'Editar Ativo' : 'Novo Ativo'}
                  </h3>
                  <div className="mt-4">
                    <AssetForm
                      initialData={selectedAsset || undefined}
                      onSubmit={selectedAsset ? handleUpdate : handleCreate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 