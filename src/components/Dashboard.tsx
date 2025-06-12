
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { KPIChart } from './KPIChart';
import { EquipmentStatus } from './EquipmentStatus';

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [comparison, setComparison] = useState('previous');

  const kpiData = [
    {
      title: 'MTBF Médio',
      value: '245h',
      change: '+12.5%',
      trend: 'up',
      description: 'Mean Time Between Failures',
      target: '240h',
      status: 'good'
    },
    {
      title: 'MTTR Médio',
      value: '4.2h',
      change: '-8.3%',
      trend: 'down',
      description: 'Mean Time To Repair',
      target: '4h',
      status: 'warning'
    },
    {
      title: 'Disponibilidade',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      description: 'Operational Availability',
      target: '98%',
      status: 'good'
    },
    {
      title: 'Eficiência OEE',
      value: '87.2%',
      change: '+5.8%',
      trend: 'up',
      description: 'Overall Equipment Effectiveness',
      target: '85%',
      status: 'good'
    }
  ];

  const maintenanceStats = [
    { type: 'Preventiva', count: 45, percentage: 60, color: 'bg-green-500' },
    { type: 'Corretiva', count: 20, percentage: 27, color: 'bg-yellow-500' },
    { type: 'Preditiva', count: 10, percentage: 13, color: 'bg-blue-500' }
  ];

  const renderTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'critical': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Manutenção</h1>
          <p className="text-muted-foreground">Monitoramento em tempo real dos KPIs e indicadores</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={comparison} onValueChange={setComparison}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">Período anterior</SelectItem>
              <SelectItem value="year">Mesmo período ano anterior</SelectItem>
              <SelectItem value="target">Meta estabelecida</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className={`metric-card border-l-4 ${getStatusColor(kpi.status)} animate-slide-in`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {renderTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Meta: {kpi.target}</div>
                  <div className="text-xs text-muted-foreground mt-1">{kpi.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Trends Chart */}
        <div className="lg:col-span-2">
          <Card className="metric-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tendências dos KPIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KPIChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </div>

        {/* Equipment Status */}
        <div>
          <Card className="metric-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Status dos Equipamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EquipmentStatus />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Maintenance Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribuição de Manutenções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <span className="font-medium">{stat.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{stat.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stat.color}`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Prioritários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-red-900">Motor Bomba B-101</div>
                    <div className="text-sm text-red-700">Vibração elevada detectada</div>
                  </div>
                </div>
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-yellow-900">Caldeira C-201</div>
                    <div className="text-sm text-yellow-700">Manutenção preventiva vencendo</div>
                  </div>
                </div>
                <Wrench className="h-4 w-4 text-yellow-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-blue-900">Válvula V-305</div>
                    <div className="text-sm text-blue-700">Substituição programada</div>
                  </div>
                </div>
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
