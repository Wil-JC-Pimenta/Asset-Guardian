import { Router } from 'express';
import {
  getFMEARecords,
  getFMEARecordById,
  createFMEARecord,
  updateFMEARecord,
  deleteFMEARecord
} from '../controllers/fmea.controller';

const router = Router();

router.get('/', getFMEARecords);
router.get('/:id', getFMEARecordById);
router.post('/', createFMEARecord);
router.put('/:id', updateFMEARecord);
router.delete('/:id', deleteFMEARecord);

export default router; 