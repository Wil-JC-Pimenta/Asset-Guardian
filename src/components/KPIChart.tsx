
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface KPIChartProps {
  timeRange: string;
}

export const KPIChart = ({ timeRange }: KPIChartProps) => {
  // Dados simulados baseados no período selecionado
  const generateData = () => {
    const baseData = [
      { period: 'Jan', mtbf: 220, mttr: 4.8, availability: 96.2, oee: 82.1 },
      { period: 'Fev', mtbf: 235, mttr: 4.5, availability: 97.1, oee: 84.3 },
      { period: 'Mar', mtbf: 245, mttr: 4.2, availability: 98.5, oee: 87.2 },
      { period: 'Abr', mtbf: 238, mttr: 4.6, availability: 97.8, oee: 85.9 },
      { period: 'Mai', mtbf: 252, mttr: 4.0, availability: 98.8, oee: 88.1 },
      { period: 'Jun', mtbf: 245, mttr: 4.2, availability: 98.5, oee: 87.2 },
    ];

    if (timeRange === '7d') {
      return [
        { period: 'Seg', mtbf: 240, mttr: 4.1, availability: 98.2, oee: 86.5 },
        { period: 'Ter', mtbf: 248, mttr: 3.9, availability: 98.7, oee: 87.8 },
        { period: 'Qua', mtbf: 245, mttr: 4.2, availability: 98.5, oee: 87.2 },
        { period: 'Qui', mtbf: 250, mttr: 4.0, availability: 98.9, oee: 88.0 },
        { period: 'Sex', mtbf: 242, mttr: 4.3, availability: 98.3, oee: 86.9 },
        { period: 'Sáb', mtbf: 255, mttr: 3.8, availability: 99.1, oee: 88.5 },
        { period: 'Dom', mtbf: 245, mttr: 4.2, availability: 98.5, oee: 87.2 },
      ];
    }

    return baseData;
  };

  const data = generateData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{`Período: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.dataKey === 'mtbf' ? 'h' : entry.dataKey === 'mttr' ? 'h' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="mtbf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-blue))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-blue))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="availability" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-green))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-green))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="period" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="mtbf"
            stroke="hsl(var(--chart-blue))"
            fillOpacity={1}
            fill="url(#mtbf)"
            strokeWidth={2}
            name="MTBF"
          />
          <Area
            type="monotone"
            dataKey="availability"
            stroke="hsl(var(--chart-green))"
            fillOpacity={1}
            fill="url(#availability)"
            strokeWidth={2}
            name="Disponibilidade"
          />
          <Line
            type="monotone"
            dataKey="oee"
            stroke="hsl(var(--chart-orange))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--chart-orange))', strokeWidth: 2, r: 4 }}
            name="OEE"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
