// src/routes/incomeDetails/profitOnSavings.routes.js
import express from 'express';
import { createProfitOnSavings, getProfitOnSavingsByUser } from '../../controllers/incomeDetails/profitOnSavings.controller.js';

const router = express.Router();

router.post('/profit-on-savings', createProfitOnSavings);
router.get('/profit-on-savings', getProfitOnSavingsByUser);

export default router;
