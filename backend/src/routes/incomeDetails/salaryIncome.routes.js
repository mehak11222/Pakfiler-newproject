import express from 'express';
import {
  createSalaryIncome,
  getSalaryIncomeByUser
} from '../../controllers/incomeDetails/salaryIncome.controller.js';

const router = express.Router();

router.post('/salary-income', createSalaryIncome);
router.get('/salary-income', getSalaryIncomeByUser);

export default router;
