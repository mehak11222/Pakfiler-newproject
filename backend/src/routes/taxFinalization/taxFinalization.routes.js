import express from 'express';
import {
  finalizeTaxFiling,
  getFinalizationStatus
} from '../../controllers/taxFinalization/taxFinalization.controller.js';

const router = express.Router();

router.post('/finalize', finalizeTaxFiling);
router.get('/finalize', getFinalizationStatus);

export default router;
