import express from 'express';
import { createOtherLiability, getOtherLiabilitiesByUser } from '../../controllers/bankLoan/otherLiability.controller.js';

const router = express.Router();
router.post('/other-liability', createOtherLiability);
router.get('/other-liability', getOtherLiabilitiesByUser);

export default router;
