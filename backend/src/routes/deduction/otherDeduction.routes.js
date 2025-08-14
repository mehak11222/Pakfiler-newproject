import express from 'express';
import {
  createOtherDeduction,
  getOtherDeductionByUser,
} from '../../controllers/deduction/otherDeduction.controller.js';

const router = express.Router();

router.post('/other-deduction', createOtherDeduction);
router.get('/other-deduction', getOtherDeductionByUser);

export default router;
