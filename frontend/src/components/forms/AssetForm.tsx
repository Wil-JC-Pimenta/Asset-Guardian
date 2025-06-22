import React from 'react';
import { useForm } from 'react-hook-form';
import { Asset } from '../../types/asset';

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const AssetForm: React.FC<AssetFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            id="code"
            {...register('code', { required: 'Código é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Nome é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
            Fabricante
          </label>
          <input
            type="text"
            id="manufacturer"
            {...register('manufacturer', { required: 'Fabricante é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.manufacturer && (
            <p className="mt-1 text-sm text-red-600">{errors.manufacturer.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            id="model"
            {...register('model', { required: 'Modelo é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <input
            type="text"
            id="type"
            {...register('type', { required: 'Tipo é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Localização
          </label>
          <input
            type="text"
            id="location"
            {...register('location', { required: 'Localização é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-700">
            Data de Aquisição
          </label>
          <input
            type="date"
            id="acquisitionDate"
            {...register('acquisitionDate', { required: 'Data de aquisição é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.acquisitionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="estimatedLife" className="block text-sm font-medium text-gray-700">
            Vida Útil Estimada (meses)
          </label>
          <input
            type="number"
            id="estimatedLife"
            {...register('estimatedLife', {
              required: 'Vida útil estimada é obrigatória',
              min: { value: 1, message: 'Vida útil deve ser maior que 0' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.estimatedLife && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedLife.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Custo
          </label>
          <input
            type="number"
            id="cost"
            step="0.01"
            {...register('cost', {
              required: 'Custo é obrigatório',
              min: { value: 0, message: 'Custo deve ser maior ou igual a 0' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
            Número de Série
          </label>
          <input
            type="text"
            id="serialNumber"
            {...register('serialNumber', { required: 'Número de série é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.serialNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="maintenance">Em Manutenção</option>
            <option value="retired">Aposentado</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}; 