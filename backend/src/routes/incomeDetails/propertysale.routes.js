import express from 'express';
import { createPropertySaleIncome, getPropertySaleIncomeByUser } from '../../controllers/incomeDetails/propertysale.controller.js';

const router = express.Router();

router.post('/property-sale-income', createPropertySaleIncome);
router.get('/property-sale-income', getPropertySaleIncomeByUser);

export default router;
