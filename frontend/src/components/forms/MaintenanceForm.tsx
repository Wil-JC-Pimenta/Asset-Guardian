import React from 'react';
import { useForm } from 'react-hook-form';
import { MaintenanceRecord } from '../../types/maintenance';
import { Asset } from '../../types/asset';

interface MaintenanceFormProps {
  initialData?: Partial<MaintenanceRecord>;
  assets: Asset[];
  onSubmit: (data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'asset'>) => void;
  isLoading?: boolean;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  initialData,
  assets,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'asset'>>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
            Ativo
          </label>
          <select
            id="assetId"
            {...register('assetId', { required: 'Ativo é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione um ativo</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.code})
              </option>
            ))}
          </select>
          {errors.assetId && (
            <p className="mt-1 text-sm text-red-600">{errors.assetId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            id="type"
            {...register('type', { required: 'Tipo é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione um tipo</option>
            <option value="preventive">Preventiva</option>
            <option value="corrective">Corretiva</option>
            <option value="predictive">Preditiva</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { required: 'Descrição é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            id="date"
            {...register('date', { required: 'Data é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
            <option value="">Selecione um status</option>
            <option value="scheduled">Agendada</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluída</option>
            <option value="cancelled">Cancelada</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">
            Responsável
          </label>
          <input
            type="text"
            id="responsible"
            {...register('responsible', { required: 'Responsável é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.responsible && (
            <p className="mt-1 text-sm text-red-600">{errors.responsible.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Prazo
          </label>
          <input
            type="date"
            id="deadline"
            {...register('deadline', { required: 'Prazo é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
            Materiais
          </label>
          <textarea
            id="materials"
            rows={3}
            {...register('materials', { required: 'Materiais são obrigatórios' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.materials && (
            <p className="mt-1 text-sm text-red-600">{errors.materials.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="failureDetails" className="block text-sm font-medium text-gray-700">
            Detalhes da Falha
          </label>
          <textarea
            id="failureDetails"
            rows={3}
            {...register('failureDetails')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
            Solução
          </label>
          <textarea
            id="solution"
            rows={3}
            {...register('solution')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
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