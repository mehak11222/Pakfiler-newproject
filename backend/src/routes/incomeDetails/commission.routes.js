import express from 'express';
import {
  createCommissionServiceIncome,
  getCommissionServiceIncomeByUser
} from '../../controllers/incomeDetails/commission.controller.js';

const router = express.Router();

router.post('/commission-service-income', createCommissionServiceIncome);
router.get('/commission-service-income', getCommissionServiceIncomeByUser);

export default router;
