import express from 'express';
import {
  createPartnershipAOPIncome,
  getPartnershipAOPIncomeByUser
} from '../../controllers/incomeDetails/partnership.controller.js';

const router = express.Router();

router.post('/partnership-income', createPartnershipAOPIncome);
router.get('/partnership-income', getPartnershipAOPIncomeByUser);

export default router;
