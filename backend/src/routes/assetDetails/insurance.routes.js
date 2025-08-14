import express from 'express';
import { createInsurance, getInsuranceByUser } from '../../controllers/assetDetails/insurance.controller.js';

const router = express.Router();
router.post('/insurance', createInsurance);
router.get('/insurance', getInsuranceByUser);

export default router;
