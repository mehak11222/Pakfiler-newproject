import express from 'express';
import { createFreelancerIncome, getFreelancerIncomeByUser } from '../../controllers/incomeDetails/freelancerIncome.controller.js';

const router = express.Router();

router.post('/freelancer-income', createFreelancerIncome);
router.get('/freelancer-income', getFreelancerIncomeByUser);

export default router;
