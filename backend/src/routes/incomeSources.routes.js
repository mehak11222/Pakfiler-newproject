// routes/incomeSources.routes.js
import express from 'express';
import { createIncomeSources, getIncomeSourcesByUser } from '../controllers/incomeSources.controller.js';

const router = express.Router();

// POST - Save income sources
router.post('/', createIncomeSources);
router.get('/', getIncomeSourcesByUser);


export default router;
