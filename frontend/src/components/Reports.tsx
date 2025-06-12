import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api, Asset, MaintenanceRecord } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface KPI {
  mtbf: number;
  mttr: number;
  oee: number;
  totalAssets: number;
  operationalAssets: number;
  maintenanceCost: number;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [maintenanceByType, setMaintenanceByType] = useState<{ type: string; count: number }[]>([]);
  const [maintenanceByStatus, setMaintenanceByStatus] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [assetsResponse, maintenanceResponse] = await Promise.all([
        api.getAssets(),
        api.getMaintenanceRecords()
      ]);

      const assets = assetsResponse.data;
      const maintenanceRecords = maintenanceResponse.data;

      // Calculate KPIs
      const totalOperationTime = maintenanceRecords.reduce((sum, record) => {
        if (record.status === 'completed') {
          return sum + (new Date(record.date).getTime() - new Date(record.asset.lastMaintenance).getTime());
        }
        return sum;
      }, 0);

      const totalRepairTime = maintenanceRecords.reduce((sum, record) => {
        if (record.status === 'completed') {
          return sum + (new Date(record.date).getTime() - new Date(record.asset.lastMaintenance).getTime());
        }
        return sum;
      }, 0);

      const failureCount = maintenanceRecords.filter(record => record.type === 'corrective').length;

      const mtbf = failureCount > 0 ? totalOperationTime / failureCount : 0;
      const mttr = failureCount > 0 ? totalRepairTime / failureCount : 0;

      // Calculate OEE (simplified version)
      const plannedProductionTime = assets.length * 24 * 60 * 60 * 1000; // 24 hours per asset
      const actualProductionTime = totalOperationTime;
      const availability = actualProductionTime / plannedProductionTime;
      const performance = 0.95; // Assuming 95% performance
      const quality = 0.98; // Assuming 98% quality
      const oee = availability * performance * quality;

      setKpis({
        mtbf,
        mttr,
        oee,
        totalAssets: assets.length,
        operationalAssets: assets.filter(a => a.status === 'Operational').length,
        maintenanceCost: maintenanceRecords.reduce((sum, record) => sum + record.cost, 0)
      });

      // Calculate maintenance by type
      const maintenanceTypes = maintenanceRecords.reduce((acc: { [key: string]: number }, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      }, {});

      setMaintenanceByType(
        Object.entries(maintenanceTypes).map(([type, count]) => ({
          type,
          count
        }))
      );

      // Calculate maintenance by status
      const maintenanceStatuses = maintenanceRecords.reduce((acc: { [key: string]: number }, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {});

      setMaintenanceByStatus(
        Object.entries(maintenanceStatuses).map(([status, count]) => ({
          status,
          count
        }))
      );

    } catch (err) {
      setError('Erro ao carregar dados dos relatórios');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !kpis) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Erro ao carregar relatórios'}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Relatórios e KPIs
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                MTBF (Horas)
              </Typography>
              <Typography variant="h4">
                {(kpis.mtbf / (1000 * 60 * 60)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                MTTR (Horas)
              </Typography>
              <Typography variant="h4">
                {(kpis.mttr / (1000 * 60 * 60)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                OEE
              </Typography>
              <Typography variant="h4">
                {(kpis.oee * 100).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manutenções por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manutenções por Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {maintenanceByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 