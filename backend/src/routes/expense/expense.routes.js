import express from 'express';
import {
  createOrUpdateExpense,
  getExpenseByUser
} from '../../controllers/expense/expense.controller.js';

const router = express.Router();

router.post('/expense', createOrUpdateExpense);
router.get('/expense', getExpenseByUser);

export default router;
