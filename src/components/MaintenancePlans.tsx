
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Wrench, Plus, CheckCircle } from 'lucide-react';

export const MaintenancePlans = () => {
  const maintenancePlans = [
    {
      id: 'MP-001',
      equipment: 'Tesoura Guilhotina TG-001',
      type: 'Preventiva',
      frequency: 'Mensal',
      nextDate: '2024-06-15',
      estimatedDuration: '4h',
      priority: 'Alta',
      responsible: 'João Silva',
      status: 'Agendada'
    },
    {
      id: 'MP-002',
      equipment: 'Laminador LP-002',
      type: 'Preditiva',
      frequency: 'Trimestral',
      nextDate: '2024-06-20',
      estimatedDuration: '6h',
      priority: 'Crítica',
      responsible: 'Maria Santos',
      status: 'Em Andamento'
    },
    {
      id: 'MP-003',
      equipment: 'Bomba Hidráulica BH-101',
      type: 'Corretiva',
      frequency: 'Sob Demanda',
      nextDate: '2024-06-12',
      estimatedDuration: '2h',
      priority: 'Urgente',
      responsible: 'Carlos Oliveira',
      status: 'Pendente'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Preventiva': return 'bg-green-100 text-green-800';
      case 'Preditiva': return 'bg-blue-100 text-blue-800';
      case 'Corretiva': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'bg-red-500';
      case 'Alta': return 'bg-orange-500';
      case 'Urgente': return 'bg-red-600';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos de Manutenção</h1>
          <p className="text-muted-foreground">Gestão de manutenções preventivas, preditivas e corretivas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">45</div>
            <div className="text-sm text-green-600">Preventivas (60%)</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">10</div>
            <div className="text-sm text-blue-600">Preditivas (13%)</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">20</div>
            <div className="text-sm text-yellow-600">Corretivas (27%)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {maintenancePlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plan.equipment}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {plan.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getTypeColor(plan.type)}>
                    {plan.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(plan.priority)}`}></div>
                    <span className="text-xs text-muted-foreground">{plan.priority}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Frequência:</span>
                  <div className="font-medium">{plan.frequency}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duração:</span>
                  <div className="font-medium">{plan.estimatedDuration}</div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Próxima execução:</span>
                  <span className="font-medium">{new Date(plan.nextDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Responsável:</span>
                <div className="font-medium">{plan.responsible}</div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Badge variant={plan.status === 'Em Andamento' ? 'default' : 'outline'}>
                  {plan.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm">
                    Executar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
