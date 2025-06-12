import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { api } from '../services/api';

interface FMEARecord {
  id: string;
  assetId: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  action: string;
  status: string;
  asset: {
    name: string;
  };
}

const severityLevels = [
  { value: 1, label: '1 - Sem efeito' },
  { value: 2, label: '2 - Muito leve' },
  { value: 3, label: '3 - Leve' },
  { value: 4, label: '4 - Moderado' },
  { value: 5, label: '5 - Significativo' },
  { value: 6, label: '6 - Grave' },
  { value: 7, label: '7 - Muito grave' },
  { value: 8, label: '8 - Extremamente grave' },
  { value: 9, label: '9 - Crítico' },
  { value: 10, label: '10 - Catastrófico' }
];

const occurrenceLevels = [
  { value: 1, label: '1 - Improvável' },
  { value: 2, label: '2 - Muito baixa' },
  { value: 3, label: '3 - Baixa' },
  { value: 4, label: '4 - Moderada' },
  { value: 5, label: '5 - Média' },
  { value: 6, label: '6 - Moderadamente alta' },
  { value: 7, label: '7 - Alta' },
  { value: 8, label: '8 - Muito alta' },
  { value: 9, label: '9 - Extremamente alta' },
  { value: 10, label: '10 - Quase certa' }
];

const detectionLevels = [
  { value: 1, label: '1 - Quase certa' },
  { value: 2, label: '2 - Muito alta' },
  { value: 3, label: '3 - Alta' },
  { value: 4, label: '4 - Moderadamente alta' },
  { value: 5, label: '5 - Média' },
  { value: 6, label: '6 - Moderada' },
  { value: 7, label: '7 - Baixa' },
  { value: 8, label: '8 - Muito baixa' },
  { value: 9, label: '9 - Extremamente baixa' },
  { value: 10, label: '10 - Improvável' }
];

const FMEA: React.FC = () => {
  const [records, setRecords] = useState<FMEARecord[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FMEARecord | null>(null);
  const [formData, setFormData] = useState<Partial<FMEARecord>>({
    assetId: '',
    failureMode: '',
    effect: '',
    cause: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
    action: '',
    status: 'Pendente'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fmeaResponse, assetsResponse] = await Promise.all([
        api.getFMEARecords(),
        api.getAssets()
      ]);
      setRecords(fmeaResponse.data);
      setAssets(assetsResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados do FMEA');
      console.error('Error fetching FMEA data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (record?: FMEARecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({
        assetId: '',
        failureMode: '',
        effect: '',
        cause: '',
        severity: 1,
        occurrence: 1,
        detection: 1,
        action: '',
        status: 'Pendente'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editingRecord) {
        await api.updateFMEARecord(editingRecord.id, formData);
      } else {
        await api.createFMEARecord(formData as Omit<FMEARecord, 'id'>);
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Erro ao salvar registro FMEA');
      console.error('Error saving FMEA record:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        setLoading(true);
        await api.deleteFMEARecord(id);
        fetchData();
      } catch (err) {
        setError('Erro ao excluir registro FMEA');
        console.error('Error deleting FMEA record:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateRPN = (severity: number, occurrence: number, detection: number) => {
    return severity * occurrence * detection;
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Análise FMEA
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Novo Registro
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ativo</TableCell>
              <TableCell>Modo de Falha</TableCell>
              <TableCell>Efeito</TableCell>
              <TableCell>Causa</TableCell>
              <TableCell>Severidade</TableCell>
              <TableCell>Ocorrência</TableCell>
              <TableCell>Detecção</TableCell>
              <TableCell>RPN</TableCell>
              <TableCell>Ação</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.asset.name}</TableCell>
                <TableCell>{record.failureMode}</TableCell>
                <TableCell>{record.effect}</TableCell>
                <TableCell>{record.cause}</TableCell>
                <TableCell>{record.severity}</TableCell>
                <TableCell>{record.occurrence}</TableCell>
                <TableCell>{record.detection}</TableCell>
                <TableCell>{record.rpn}</TableCell>
                <TableCell>{record.action}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(record)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(record.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRecord ? 'Editar Registro FMEA' : 'Novo Registro FMEA'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Ativo"
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                required
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Modo de Falha"
                value={formData.failureMode}
                onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Efeito"
                value={formData.effect}
                onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Causa"
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Severidade"
                value={formData.severity}
                onChange={(e) => {
                  const severity = Number(e.target.value);
                  setFormData({
                    ...formData,
                    severity,
                    rpn: calculateRPN(severity, formData.occurrence || 1, formData.detection || 1)
                  });
                }}
                required
              >
                {severityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Ocorrência"
                value={formData.occurrence}
                onChange={(e) => {
                  const occurrence = Number(e.target.value);
                  setFormData({
                    ...formData,
                    occurrence,
                    rpn: calculateRPN(formData.severity || 1, occurrence, formData.detection || 1)
                  });
                }}
                required
              >
                {occurrenceLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Detecção"
                value={formData.detection}
                onChange={(e) => {
                  const detection = Number(e.target.value);
                  setFormData({
                    ...formData,
                    detection,
                    rpn: calculateRPN(formData.severity || 1, formData.occurrence || 1, detection)
                  });
                }}
                required
              >
                {detectionLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ação Recomendada"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                <MenuItem value="Concluído">Concluído</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FMEA; 