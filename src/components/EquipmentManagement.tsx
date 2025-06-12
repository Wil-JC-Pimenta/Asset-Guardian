
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Settings,
  BarChart3,
  Calendar,
  Wrench
} from 'lucide-react';

export const EquipmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const equipments = [
    {
      id: 'TG-001',
      name: 'Tesoura Guilhotina Principal',
      type: 'Equipamento de Corte',
      location: 'Linha de Produção 1',
      status: 'Operacional',
      mtbf: '245h',
      mttr: '3.2h',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-06-15',
      criticality: 'Alta'
    },
    {
      id: 'LP-002',
      name: 'Laminador de Bobinas',
      type: 'Equipamento de Laminação',
      location: 'Linha de Produção 2',
      status: 'Manutenção',
      mtbf: '189h',
      mttr: '5.1h',
      lastMaintenance: '2024-06-08',
      nextMaintenance: '2024-07-08',
      criticality: 'Crítica'
    },
    {
      id: 'FR-003',
      name: 'Forno de Recozimento',
      type: 'Equipamento Térmico',
      location: 'Área de Tratamento Térmico',
      status: 'Atenção',
      mtbf: '312h',
      mttr: '4.8h',
      lastMaintenance: '2024-05-28',
      nextMaintenance: '2024-06-12',
      criticality: 'Alta'
    },
    {
      id: 'BH-101',
      name: 'Bomba Hidráulica Principal',
      type: 'Sistema Hidráulico',
      location: 'Casa de Bombas',
      status: 'Operacional',
      mtbf: '428h',
      mttr: '2.1h',
      lastMaintenance: '2024-05-20',
      nextMaintenance: '2024-06-20',
      criticality: 'Média'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operacional': return 'bg-green-100 text-green-800 border-green-200';
      case 'manutenção': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'atenção': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'crítico': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case 'crítica': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'média': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredEquipments = equipments.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Equipamentos</h1>
          <p className="text-muted-foreground">Controle e monitoramento de ativos industriais</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipamento, TAG ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{equipment.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">TAG: {equipment.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getCriticalityColor(equipment.criticality)}`}></div>
                    <span className="text-xs text-muted-foreground">{equipment.criticality}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">MTBF:</span>
                  <span className="font-medium ml-2">{equipment.mtbf}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">MTTR:</span>
                  <span className="font-medium ml-2">{equipment.mttr}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-xs text-muted-foreground mb-1">Localização</div>
                <div className="text-sm font-medium">{equipment.location}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Última Manutenção</div>
                  <div className="font-medium">{new Date(equipment.lastMaintenance).toLocaleDateString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Próxima Manutenção</div>
                  <div className="font-medium">{new Date(equipment.nextMaintenance).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Detalhes
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Agendar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Wrench className="h-3 w-3 mr-1" />
                  Manutenção
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">12</div>
            <div className="text-sm text-green-600">Operacionais</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-800">3</div>
            <div className="text-sm text-yellow-600">Atenção</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">2</div>
            <div className="text-sm text-blue-600">Em Manutenção</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-800">1</div>
            <div className="text-sm text-red-600">Críticos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
