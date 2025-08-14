import express from 'express';
import {
  createVehicleDeduction,
  getVehicleDeductionsByUser,
} from '../../controllers/deduction/vehicleDeduction.controller.js';

const router = express.Router();

router.post('/vehicle-deduction', createVehicleDeduction);
router.get('/vehicle-deduction', getVehicleDeductionsByUser);

export default router;
