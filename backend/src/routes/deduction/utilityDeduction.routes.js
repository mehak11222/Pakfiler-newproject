import express from 'express';
import {
  createUtilityDeduction,
  getUtilityDeductionsByUser,
} from '../../controllers/deduction/utilityDeduction.controller.js';

const router = express.Router();

router.post('/utility-deduction', createUtilityDeduction);
router.get('/utility-deduction', getUtilityDeductionsByUser);

export default router;
