// File: src/routes/taxFiling/taxFiling.Routes.js
import express from 'express';
import { getTaxFilingSummary } from '../../controllers/getTaxFilingSummary/taxFilingSummary.controller.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

router.get('/summary/:userId/:taxYear', verifyUser, getTaxFilingSummary);

export default router;
