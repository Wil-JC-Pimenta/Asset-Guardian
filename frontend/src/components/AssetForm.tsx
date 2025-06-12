import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { api, Asset } from '../services/api';

const assetTypes = [
  'Equipamento',
  'Máquina',
  'Veículo',
  'Instalação'
];

const assetStatus = [
  'Operacional',
  'Em Manutenção',
  'Inativo',
  'Aguardando Peças'
];

const formatDate = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const AssetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<Partial<Asset>>({
    code: '',
    name: '',
    manufacturer: '',
    model: '',
    type: assetTypes[0],
    location: '',
    acquisitionDate: formatDate(new Date().toISOString()),
    estimatedLife: 60,
    cost: 0,
    serialNumber: '',
    status: assetStatus[0]
  });

  useEffect(() => {
    if (id) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const data = await api.getAssetById(id!);
      setAsset({
        ...data,
        acquisitionDate: formatDate(data.acquisitionDate),
        lastMaintenance: formatDate(data.lastMaintenance),
        nextMaintenance: formatDate(data.nextMaintenance)
      });
    } catch (err) {
      setError('Erro ao carregar ativo');
      console.error('Error fetching asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const assetData = {
        ...asset,
        cost: Number(asset.cost),
        estimatedLife: Number(asset.estimatedLife)
      };

      if (id) {
        await api.updateAsset(id, assetData);
      } else {
        await api.createAsset(assetData as Omit<Asset, 'id'>);
      }
      navigate('/assets');
    } catch (err) {
      setError('Erro ao salvar ativo');
      console.error('Error saving asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  if (loading && id) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Ativo' : 'Novo Ativo'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                name="code"
                value={asset.code}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={asset.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fabricante"
                name="manufacturer"
                value={asset.manufacturer}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Modelo"
                name="model"
                value={asset.model}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Tipo"
                name="type"
                value={asset.type}
                onChange={handleChange}
                required
              >
                {assetTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localização"
                name="location"
                value={asset.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Aquisição"
                name="acquisitionDate"
                value={asset.acquisitionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Vida Útil Estimada (meses)"
                name="estimatedLife"
                value={asset.estimatedLife}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Custo"
                name="cost"
                value={asset.cost}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Série"
                name="serialNumber"
                value={asset.serialNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={asset.status}
                onChange={handleChange}
                required
              >
                {assetStatus.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Última Manutenção"
                name="lastMaintenance"
                value={asset.lastMaintenance}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Próxima Manutenção"
                name="nextMaintenance"
                value={asset.nextMaintenance}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/assets')}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AssetForm; 