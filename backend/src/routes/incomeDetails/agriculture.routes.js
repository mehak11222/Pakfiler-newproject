import express from 'express';
import {
  createAgricultureIncome,
  getAgricultureIncomeByUser
} from '../../controllers/incomeDetails/agriculture.controller.js';

const router = express.Router();

router.post('/agriculture-income', createAgricultureIncome);
router.get('/agriculture-income', getAgricultureIncomeByUser);

export default router;
