
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

export const EquipmentStatus = () => {
  const equipmentData = [
    {
      name: 'Tesoura Guilhotina',
      status: 'operational',
      availability: 98.5,
      nextMaintenance: '3 dias',
      location: 'Linha 1'
    },
    {
      name: 'Laminador Principal',
      status: 'maintenance',
      availability: 0,
      nextMaintenance: 'Em andamento',
      location: 'Linha 2'
    },
    {
      name: 'Forno Recozimento',
      status: 'warning',
      availability: 87.2,
      nextMaintenance: 'Hoje',
      location: 'Área Térmica'
    },
    {
      name: 'Bomba Hidráulica B-101',
      status: 'operational',
      availability: 99.1,
      nextMaintenance: '7 dias',
      location: 'Casa de Bombas'
    },
    {
      name: 'Motor Elétrico M-205',
      status: 'critical',
      availability: 45.8,
      nextMaintenance: 'Urgente',
      location: 'Linha 3'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      operational: 'default',
      warning: 'secondary',
      critical: 'destructive',
      maintenance: 'outline'
    };

    const labels = {
      operational: 'Operacional',
      warning: 'Atenção',
      critical: 'Crítico',
      maintenance: 'Manutenção'
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {labels[status] || 'Desconhecido'}
      </Badge>
    );
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 95) return 'bg-green-500';
    if (availability >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const statusSummary = {
    operational: equipmentData.filter(eq => eq.status === 'operational').length,
    warning: equipmentData.filter(eq => eq.status === 'warning').length,
    critical: equipmentData.filter(eq => eq.status === 'critical').length,
    maintenance: equipmentData.filter(eq => eq.status === 'maintenance').length,
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-lg font-bold text-green-900">{statusSummary.operational}</div>
            <div className="text-xs text-green-700">Operacional</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <div>
            <div className="text-lg font-bold text-yellow-900">{statusSummary.warning}</div>
            <div className="text-xs text-yellow-700">Atenção</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <div>
            <div className="text-lg font-bold text-red-900">{statusSummary.critical}</div>
            <div className="text-xs text-red-700">Crítico</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-blue-900">{statusSummary.maintenance}</div>
            <div className="text-xs text-blue-700">Manutenção</div>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-3">
        {equipmentData.map((equipment, index) => (
          <div key={index} className="p-3 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(equipment.status)}
                <div>
                  <div className="font-medium text-sm text-foreground">{equipment.name}</div>
                  <div className="text-xs text-muted-foreground">{equipment.location}</div>
                </div>
              </div>
              {getStatusBadge(equipment.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Disponibilidade</span>
                <span className="font-medium">{equipment.availability}%</span>
              </div>
              <Progress 
                value={equipment.availability} 
                className="h-2"
              />
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Próxima manutenção</span>
                <span className="font-medium">{equipment.nextMaintenance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
