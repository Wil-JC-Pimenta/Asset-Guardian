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
import { useFMEA } from '../hooks/useFMEA';
import { useAssets } from '../hooks/useAssets';
import { FMEARecord } from '../services/api';

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
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useFMEA();
  const { assets } = useAssets();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FMEARecord | null>(null);
  const [formData, setFormData] = useState<Partial<FMEARecord>>({
    assetId: '',
    failureMode: '',
    potentialEffect: '',
    severity: 1,
    occurrence: 1,
    detection: 1,
    recommendedAction: '',
    responsible: '',
    status: 'Pendente'
  });

  const handleOpenDialog = (record?: FMEARecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({
        assetId: '',
        failureMode: '',
        potentialEffect: '',
        severity: 1,
        occurrence: 1,
        detection: 1,
        recommendedAction: '',
        responsible: '',
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
      if (editingRecord) {
        await updateRecord(editingRecord.id, formData);
      } else {
        await createRecord(formData as Omit<FMEARecord, 'id' | 'asset'>);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving FMEA record:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteRecord(id);
      } catch (err) {
        console.error('Error deleting FMEA record:', err);
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
              <TableCell>Efeito Potencial</TableCell>
              <TableCell>Severidade</TableCell>
              <TableCell>Ocorrência</TableCell>
              <TableCell>Detecção</TableCell>
              <TableCell>RPN</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.asset.name}</TableCell>
                <TableCell>{record.failureMode}</TableCell>
                <TableCell>{record.potentialEffect}</TableCell>
                <TableCell>{record.severity}</TableCell>
                <TableCell>{record.occurrence}</TableCell>
                <TableCell>{record.detection}</TableCell>
                <TableCell>{record.rpn}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(record)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
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
                value={formData.assetId || ''}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
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
                value={formData.failureMode || ''}
                onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Efeito Potencial"
                multiline
                rows={3}
                value={formData.potentialEffect || ''}
                onChange={(e) => setFormData({ ...formData, potentialEffect: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Severidade"
                value={formData.severity || 1}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
              >
                {severityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Ocorrência"
                value={formData.occurrence || 1}
                onChange={(e) => setFormData({ ...formData, occurrence: parseInt(e.target.value) })}
              >
                {occurrenceLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Detecção"
                value={formData.detection || 1}
                onChange={(e) => setFormData({ ...formData, detection: parseInt(e.target.value) })}
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
                multiline
                rows={3}
                value={formData.recommendedAction || ''}
                onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Responsável"
                value={formData.responsible || ''}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Status"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </Grid>
            {formData.severity && formData.occurrence && formData.detection && (
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  RPN: {calculateRPN(formData.severity, formData.occurrence, formData.detection)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FMEA; 