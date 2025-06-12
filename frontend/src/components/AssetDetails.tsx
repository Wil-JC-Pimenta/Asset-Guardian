import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { api, Asset, MaintenanceRecord } from '../services/api';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      const [assetData, maintenanceData] = await Promise.all([
        api.getAssetById(id!),
        api.getMaintenanceRecords({ assetId: id })
      ]);
      setAsset(assetData);
      setMaintenanceHistory(maintenanceData.data);
    } catch (err) {
      setError('Erro ao carregar detalhes do ativo');
      console.error('Error fetching asset details:', err);
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

  if (error || !asset) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Ativo não encontrado'}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/assets')}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/assets/${id}/edit`)}
        >
          Editar
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        {asset.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações do Ativo
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Código"
                  secondary={asset.id}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Tipo"
                  secondary={asset.type}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Localização"
                  secondary={asset.location}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={asset.status}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Última Manutenção"
                  secondary={new Date(asset.lastMaintenance).toLocaleDateString()}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Próxima Manutenção"
                  secondary={new Date(asset.nextMaintenance).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Manutenções
            </Typography>
            {maintenanceHistory.length > 0 ? (
              <List>
                {maintenanceHistory.map((record) => (
                  <React.Fragment key={record.id}>
                    <ListItem>
                      <ListItemText
                        primary={record.type}
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
            ) : (
              <Typography color="text.secondary">
                Nenhum registro de manutenção encontrado.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetails; 