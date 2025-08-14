import express from 'express';
import {
  createDividendCapitalGainIncome,
  getDividendCapitalGainIncomeByUser
} from '../../controllers/incomeDetails/dividend.controller.js';

const router = express.Router();


router.post('/dividend-income', createDividendCapitalGainIncome);
router.get('/dividend-income', getDividendCapitalGainIncomeByUser);

export default router;
