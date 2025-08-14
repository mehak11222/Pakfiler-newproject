import express from 'express';
import { createBankLoan, getBankLoansByUser } from '../../controllers/bankLoan/bankLoan.controller.js';

const router = express.Router();
router.post('/bank-loan', createBankLoan);
router.get('/bank-loan', getBankLoansByUser);

export default router;
