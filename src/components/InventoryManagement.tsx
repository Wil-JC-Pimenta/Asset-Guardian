
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, AlertTriangle, TrendingDown } from 'lucide-react';

export const InventoryManagement = () => {
  const sparePartsData = [
    { id: 'ROL-001', name: 'Rolamento SKF 6308', category: 'Rolamentos', stock: 15, minStock: 5, maxStock: 30, location: 'A-15-B', status: 'OK', cost: 'R$ 245,00' },
    { id: 'MOT-002', name: 'Motor WEG 5CV', category: 'Motores', stock: 2, minStock: 3, maxStock: 8, location: 'B-22-A', status: 'Baixo', cost: 'R$ 1.850,00' },
    { id: 'VAL-003', name: 'Válvula de Segurança', category: 'Válvulas', stock: 8, minStock: 2, maxStock: 12, location: 'C-08-C', status: 'OK', cost: 'R$ 680,00' },
    { id: 'COR-004', name: 'Correia Dentada', category: 'Transmissão', stock: 0, minStock: 4, maxStock: 20, location: 'A-03-A', status: 'Crítico', cost: 'R$ 125,00' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-100 text-green-800';
      case 'Baixo': return 'bg-yellow-100 text-yellow-800';
      case 'Crítico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Inventário</h1>
          <p className="text-muted-foreground">Controle de sobressalentes e peças de reposição</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">247</div>
            <div className="text-sm text-blue-600">Total de Itens</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-800">12</div>
            <div className="text-sm text-yellow-600">Estoque Baixo</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-800">3</div>
            <div className="text-sm text-red-600">Estoque Crítico</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">R$ 2.4M</div>
            <div className="text-sm text-green-600">Valor Total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Itens de Estoque</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Buscar itens..." className="w-64" />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sparePartsData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {item.id} | {item.category}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground">Estoque Atual</div>
                    <div className="font-bold text-lg">{item.stock}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Mín/Máx</div>
                    <div>{item.minStock}/{item.maxStock}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Localização</div>
                    <div>{item.location}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Custo Unit.</div>
                    <div className="font-medium">{item.cost}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm">Reabastecer</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
