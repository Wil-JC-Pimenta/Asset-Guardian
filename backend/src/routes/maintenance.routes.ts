import { Router } from 'express';
import {
  getMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
} from '../controllers/maintenance.controller';

const router = Router();

router.get('/', getMaintenanceRecords);
router.get('/:id', getMaintenanceRecordById);
router.post('/', createMaintenanceRecord);
router.put('/:id', updateMaintenanceRecord);
router.delete('/:id', deleteMaintenanceRecord);

export default router; 