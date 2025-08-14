import express from 'express';
import { upsertTaxCredit, getTaxCreditByUser } from '../../controllers/taxCredits/taxCredits.controller.js';

const router = express.Router();

router.post('/', upsertTaxCredit);
router.get('/', getTaxCreditByUser);
export default router;
