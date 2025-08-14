import express from 'express';
import {
  createOtherIncome,
  getOtherIncomeByUser
} from '../../controllers/incomeDetails/otherincome.controller.js';

const router = express.Router();

// Create Other Income
router.post('/other-income', createOtherIncome);

// Get Other Income for logged-in user
router.get('/other-income', getOtherIncomeByUser);

export default router;
