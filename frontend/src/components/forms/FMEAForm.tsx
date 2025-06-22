import React from 'react';
import { useForm } from 'react-hook-form';
import { FMEARecord } from '../../types/fmea';
import { Asset } from '../../types/asset';

interface FMEAFormProps {
  initialData?: Partial<FMEARecord>;
  assets: Asset[];
  onSubmit: (data: Omit<FMEARecord, 'id' | 'asset'>) => void;
  isLoading?: boolean;
}

export const FMEAForm: React.FC<FMEAFormProps> = ({
  initialData,
  assets,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<FMEARecord, 'id' | 'asset'>>({
    defaultValues: initialData,
  });

  const severity = watch('severity', 1);
  const occurrence = watch('occurrence', 1);
  const detection = watch('detection', 1);
  const rpn = severity * occurrence * detection;

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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione um status</option>
            <option value="open">Aberto</option>
            <option value="in_progress">Em Andamento</option>
            <option value="closed">Fechado</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="failureMode" className="block text-sm font-medium text-gray-700">
            Modo de Falha
          </label>
          <textarea
            id="failureMode"
            rows={3}
            {...register('failureMode', { required: 'Modo de falha é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.failureMode && (
            <p className="mt-1 text-sm text-red-600">{errors.failureMode.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="effect" className="block text-sm font-medium text-gray-700">
            Efeito
          </label>
          <textarea
            id="effect"
            rows={3}
            {...register('effect', { required: 'Efeito é obrigatório' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.effect && (
            <p className="mt-1 text-sm text-red-600">{errors.effect.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
            Causa
          </label>
          <textarea
            id="cause"
            rows={3}
            {...register('cause', { required: 'Causa é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.cause && (
            <p className="mt-1 text-sm text-red-600">{errors.cause.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
            Severidade (1-10)
          </label>
          <input
            type="number"
            id="severity"
            min={1}
            max={10}
            {...register('severity', {
              required: 'Severidade é obrigatória',
              min: { value: 1, message: 'Severidade deve ser entre 1 e 10' },
              max: { value: 10, message: 'Severidade deve ser entre 1 e 10' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="occurrence" className="block text-sm font-medium text-gray-700">
            Ocorrência (1-10)
          </label>
          <input
            type="number"
            id="occurrence"
            min={1}
            max={10}
            {...register('occurrence', {
              required: 'Ocorrência é obrigatória',
              min: { value: 1, message: 'Ocorrência deve ser entre 1 e 10' },
              max: { value: 10, message: 'Ocorrência deve ser entre 1 e 10' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.occurrence && (
            <p className="mt-1 text-sm text-red-600">{errors.occurrence.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="detection" className="block text-sm font-medium text-gray-700">
            Detecção (1-10)
          </label>
          <input
            type="number"
            id="detection"
            min={1}
            max={10}
            {...register('detection', {
              required: 'Detecção é obrigatória',
              min: { value: 1, message: 'Detecção deve ser entre 1 e 10' },
              max: { value: 10, message: 'Detecção deve ser entre 1 e 10' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.detection && (
            <p className="mt-1 text-sm text-red-600">{errors.detection.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="rpn" className="block text-sm font-medium text-gray-700">
            RPN (Severidade × Ocorrência × Detecção)
          </label>
          <input
            type="number"
            id="rpn"
            value={rpn}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="action" className="block text-sm font-medium text-gray-700">
            Ação
          </label>
          <textarea
            id="action"
            rows={3}
            {...register('action', { required: 'Ação é obrigatória' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.action && (
            <p className="mt-1 text-sm text-red-600">{errors.action.message}</p>
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