import express from 'express';
import {
  createRentIncome,
  getRentIncomeByUser
} from '../../controllers/incomeDetails/rent.controller.js';

const router = express.Router();

// Create Rent Income Entry
router.post('/rent-income', createRentIncome);

// Get Rent Income Entry by User and Tax Year
router.get('/rent-income', getRentIncomeByUser);

export default router;
