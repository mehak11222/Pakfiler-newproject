// src/routes/incomeDetails/businessIncome.routes.js
import express from 'express';
import { createBusinessIncome, getBusinessIncomeByUser } from '../../controllers/incomeDetails/businessIncome.controller.js';

const router = express.Router();

router.post('/business-income', createBusinessIncome);
router.get('/business-income', getBusinessIncomeByUser);

export default router;
