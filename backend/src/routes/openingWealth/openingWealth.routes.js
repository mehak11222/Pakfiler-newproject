import express from 'express';
import {
  saveOpeningWealth,
  getOpeningWealth
} from '../../controllers/openingWealth/openingWealth.controller.js';

const router = express.Router();

router.post('/opening-wealth', saveOpeningWealth);
router.get('/opening-wealth', getOpeningWealth);

export default router;
