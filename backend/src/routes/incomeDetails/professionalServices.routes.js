// src/routes/incomeDetails/professionalServices.routes.js
import express from 'express';
import {
  createProfessionalServicesIncome,
  getProfessionalServicesIncomeByUser
} from '../../controllers/incomeDetails/professionalServices.controller.js';

const router = express.Router();

router.post('/professional-services-income', createProfessionalServicesIncome);
router.get('/professional-services-income', getProfessionalServicesIncomeByUser);

export default router;
