import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api, Asset, MaintenanceRecord } from '../services/api';

interface DashboardData {
  totalAssets: number;
  operationalAssets: number;
  maintenanceAssets: number;
  totalMaintenanceCost: number;
  upcomingMaintenance: MaintenanceRecord[];
  recentMaintenance: MaintenanceRecord[];
  assetsByType: { type: string; count: number }[];
  assetsByStatus: { status: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch assets and maintenance records in parallel
      const [assetsResponse, maintenanceResponse] = await Promise.all([
        api.getAssets({ limit: 1000 }), // Fetch all assets
        api.getMaintenanceRecords({ limit: 1000 }) // Fetch all maintenance records
      ]);

      const assets = assetsResponse.data;
      const maintenanceRecords = maintenanceResponse.data;

      const dashboardData: DashboardData = {
        totalAssets: assets.length,
        operationalAssets: assets.filter((a) => a.status === 'ACTIVE').length,
        maintenanceAssets: assets.filter((a) => a.status === 'MAINTENANCE').length,
        totalMaintenanceCost: maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0),
        upcomingMaintenance: maintenanceRecords
          .filter((record) => new Date(record.deadline) > new Date())
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
          .slice(0, 5),
        recentMaintenance: maintenanceRecords
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5),
        assetsByType: Object.entries(
          assets.reduce((acc: { [key: string]: number }, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + 1;
            return acc;
          }, {})
        ).map(([type, count]) => ({ type, count })),
        assetsByStatus: Object.entries(
          assets.reduce((acc: { [key: string]: number }, asset) => {
            acc[asset.status] = (acc[asset.status] || 0) + 1;
            return acc;
          }, {})
        ).map(([status, count]) => ({ status, count }))
      };

      setDashboardData(dashboardData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Error fetching dashboard data:', err);
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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Ativos
              </Typography>
              <Typography variant="h4">{dashboardData.totalAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ativos Operacionais
              </Typography>
              <Typography variant="h4">{dashboardData.operationalAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Em Manutenção
              </Typography>
              <Typography variant="h4">{dashboardData.maintenanceAssets}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Custo Total de Manutenção
              </Typography>
              <Typography variant="h4">
                R$ {dashboardData.totalMaintenanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ativos por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.assetsByType}>
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
              Ativos por Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.assetsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dashboardData.assetsByStatus.map((entry, index) => (
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

      {/* Maintenance Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Próximas Manutenções
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.upcomingMaintenance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.asset.name}</TableCell>
                      <TableCell>
                        {format(new Date(record.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manutenções Recentes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentMaintenance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.asset.name}</TableCell>
                      <TableCell>
                        {format(new Date(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 