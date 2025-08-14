import express from 'express';
import { createBankAccount, getBankAccountByUser } from '../../controllers/assetDetails/bankAccount.controller.js';

const router = express.Router();
router.post('/bank-account', createBankAccount);
router.get('/bank-account', getBankAccountByUser);

export default router;
