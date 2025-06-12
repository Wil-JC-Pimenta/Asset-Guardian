import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { api, MaintenanceRecord } from '../services/api';

const maintenanceTypes = {
  'preventive': 'Preventiva',
  'corrective': 'Corretiva',
  'predictive': 'Preditiva',
  'emergency': 'Emergencial'
};

const maintenanceStatus = {
  'scheduled': 'Agendada',
  'in_progress': 'Em Andamento',
  'completed': 'Concluída',
  'cancelled': 'Cancelada'
};

const statusColors = {
  'scheduled': 'info',
  'in_progress': 'warning',
  'completed': 'success',
  'cancelled': 'error'
} as const;

const MaintenanceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<MaintenanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceDetails();
  }, [id]);

  const fetchMaintenanceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getMaintenanceRecordById(id!);
      setMaintenance(response);
    } catch (err) {
      setError('Erro ao carregar detalhes da manutenção');
      console.error('Error fetching maintenance details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este registro de manutenção?')) {
      try {
        await api.deleteMaintenanceRecord(id!);
        navigate('/maintenance');
      } catch (err) {
        setError('Erro ao excluir registro de manutenção');
        console.error('Error deleting maintenance record:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !maintenance) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Registro de manutenção não encontrado'}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenance')}
        >
          Voltar para Lista
        </Button>
        <Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/maintenance/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Detalhes da Manutenção
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ativo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {maintenance.asset.name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tipo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {maintenanceTypes[maintenance.type as keyof typeof maintenanceTypes]}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={maintenanceStatus[maintenance.status as keyof typeof maintenanceStatus]}
                  color={statusColors[maintenance.status as keyof typeof statusColors]}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(maintenance.date).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Prazo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {maintenance.deadline
                    ? new Date(maintenance.deadline).toLocaleDateString()
                    : 'Não definido'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Custo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  R$ {maintenance.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Responsável
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {maintenance.responsible}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Descrição
                </Typography>
                <Typography variant="body1" paragraph>
                  {maintenance.description}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Materiais
                </Typography>
                <Typography variant="body1" paragraph>
                  {maintenance.materials}
                </Typography>
              </Grid>

              {maintenance.type === 'corrective' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Detalhes da Falha
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {maintenance.failureDetails}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Solução Aplicada
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {maintenance.solution}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Manutenções do Ativo
              </Typography>
              <List>
                {maintenance.asset.maintenance?.map((record) => (
                  <React.Fragment key={record.id}>
                    <ListItem>
                      <ListItemText
                        primary={maintenanceTypes[record.type as keyof typeof maintenanceTypes]}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(record.date).toLocaleDateString()}
                            </Typography>
                            <br />
                            {record.description}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaintenanceDetails; 