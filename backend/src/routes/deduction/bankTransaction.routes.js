import express from 'express';
import {
  createBankTransaction,
  getBankTransactionsByUser,
} from '../../controllers/deduction/bankTransaction.controller.js';

const router = express.Router();

router.post('/bank-transaction', createBankTransaction);
router.get('/bank-transaction', getBankTransactionsByUser);

export default router;
