import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { api, Asset } from '../services/api';

interface MaintenanceFormData {
  assetId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: string;
  responsible: string;
  deadline: string;
  materials: string;
  failureDetails?: string;
  solution?: string;
  attachments?: string;
}

const maintenanceTypes = [
  { value: 'preventive', label: 'Preventiva' },
  { value: 'corrective', label: 'Corretiva' },
  { value: 'predictive', label: 'Preditiva' },
  { value: 'emergency', label: 'Emergencial' }
];

const maintenanceStatus = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' }
];

const MaintenanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    assetId: '',
    type: 'preventive',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'scheduled',
    responsible: '',
    deadline: '',
    materials: '',
    failureDetails: '',
    solution: '',
    attachments: ''
  });

  useEffect(() => {
    fetchAssets();
    if (id) {
      fetchMaintenanceRecord();
    }
  }, [id]);

  const fetchAssets = async () => {
    try {
      const response = await api.getAssets();
      setAssets(response.data);
    } catch (err) {
      setError('Erro ao carregar ativos');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceRecord = async () => {
    try {
      const response = await api.getMaintenanceRecordById(id!);
      setFormData({
        ...response,
        date: new Date(response.date).toISOString().split('T')[0],
        deadline: response.deadline ? new Date(response.deadline).toISOString().split('T')[0] : ''
      });
    } catch (err) {
      setError('Erro ao carregar registro de manutenção');
      console.error('Error fetching maintenance record:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await api.updateMaintenanceRecord(id, formData);
      } else {
        const { createdAt, updatedAt, ...createData } = formData as any;
        await api.createMaintenanceRecord(createData);
      }
      navigate('/maintenance');
    } catch (err) {
      setError('Erro ao salvar registro de manutenção');
      console.error('Error saving maintenance record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Manutenção' : 'Nova Manutenção'}
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
              <FormControl fullWidth required>
                <InputLabel>Ativo</InputLabel>
                <Select
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleSelectChange}
                  label="Ativo"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  label="Tipo"
                >
                  {maintenanceTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {maintenanceStatus.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="date"
                label="Data"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="deadline"
                label="Prazo"
                value={formData.deadline}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                name="cost"
                label="Custo"
                value={formData.cost}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: 'R$'
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="responsible"
                label="Responsável"
                value={formData.responsible}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                name="description"
                label="Descrição"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="materials"
                label="Materiais"
                value={formData.materials}
                onChange={handleInputChange}
                helperText="Liste os materiais necessários, separados por vírgula"
              />
            </Grid>

            {formData.type === 'corrective' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="failureDetails"
                    label="Detalhes da Falha"
                    value={formData.failureDetails}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="solution"
                    label="Solução Aplicada"
                    value={formData.solution}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/maintenance')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : id ? 'Atualizar' : 'Criar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default MaintenanceForm; 