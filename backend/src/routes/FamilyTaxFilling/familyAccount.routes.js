// File: src/routes/familyAccount.routes.js
import express from 'express';
import {
  createFamilyAccount,
  tagExistingAccount,
  getAllFamilyAccounts,
  getFamilyAccountById
} from '../../controllers/FamilyTaxFilling/familyAccount.controller.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createFamilyAccount);
router.post('/tag', verifyUser, tagExistingAccount);
router.get('/', verifyUser, getAllFamilyAccounts);
router.get('/:id', verifyUser, getFamilyAccountById); 

export default router;
