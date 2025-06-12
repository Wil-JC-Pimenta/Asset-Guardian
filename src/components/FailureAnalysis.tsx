import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, FileText, Plus, Target } from 'lucide-react';

export const FailureAnalysis = () => {
  const failureData = [
    {
      id: 'FA-001',
      equipment: 'Motor Elétrico M-205',
      failureMode: 'Superaquecimento',
      severity: 'Alta',
      frequency: 'Média',
      detection: 'Baixa',
      rpn: 64,
      rootCause: 'Falta de lubrificação',
      actions: 'Implementar lubrificação programada',
      status: 'Em Andamento'
    },
    {
      id: 'FA-002',
      equipment: 'Válvula de Segurança V-101',
      failureMode: 'Vazamento interno',
      severity: 'Crítica',
      frequency: 'Baixa',
      detection: 'Alta',
      rpn: 32,
      rootCause: 'Desgaste do selo',
      actions: 'Substituição preventiva do selo',
      status: 'Concluída'
    },
    {
      id: 'FA-003',
      equipment: 'Bomba Centrífuga B-102',
      failureMode: 'Cavitação',
      severity: 'Média',
      frequency: 'Alta',
      detection: 'Média',
      rpn: 48,
      rootCause: 'NPSH insuficiente',
      actions: 'Ajuste da altura de sucção',
      status: 'Planejada'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Crítica': 
        return 'status-critical';
      case 'Alta': 
        return 'rpn-medium';
      case 'Média': 
        return 'rpn-medium';
      case 'Baixa': 
        return 'status-operational';
      default: 
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRPNColor = (rpn: number) => {
    if (rpn >= 64) return 'rpn-high';
    if (rpn >= 32) return 'rpn-medium';
    return 'rpn-low';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Falhas (FMEA)</h1>
          <p className="text-muted-foreground">Failure Mode and Effects Analysis - Análise de modos de falha</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise FMEA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="status-critical">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">8</div>
            <div className="text-sm text-red-600">RPN Alto (≥64)</div>
          </CardContent>
        </Card>
        
        <Card className="rpn-medium">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700">15</div>
            <div className="text-sm text-amber-600">RPN Médio (32-63)</div>
          </CardContent>
        </Card>
        
        <Card className="status-operational">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">22</div>
            <div className="text-sm text-green-600">RPN Baixo (&lt;32)</div>
          </CardContent>
        </Card>
        
        <Card className="kpi-neutral">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">45</div>
            <div className="text-sm text-blue-600">Total de Análises</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {failureData.map((failure) => (
          <Card key={failure.id} className="hover:shadow-lg transition-shadow border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{failure.equipment}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {failure.id} | Modo de falha: {failure.failureMode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getRPNColor(failure.rpn)}`}>
                    RPN: {failure.rpn}
                  </div>
                  <Badge variant={failure.status === 'Concluída' ? 'default' : 'outline'}>
                    {failure.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Avaliação de Risco</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Severidade:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${getSeverityColor(failure.severity)}`}></div>
                        <span className="text-sm font-medium">{failure.severity}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Frequência:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${getSeverityColor(failure.frequency)}`}></div>
                        <span className="text-sm font-medium">{failure.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Detecção:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${getSeverityColor(failure.detection)}`}></div>
                        <span className="text-sm font-medium">{failure.detection}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Análise da Causa Raiz</h4>
                  <p className="text-sm">{failure.rootCause}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Ações Recomendadas</h4>
                  <p className="text-sm">{failure.actions}</p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                    <Button size="sm">
                      Implementar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
