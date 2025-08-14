import express from 'express';
import {
  createServiceCharge,
  getAllServiceCharges,
  getServiceCategories,
  updateServiceCharge,
   deleteServiceCharge,
    getServiceChargeCount
} from '../../controllers/ServiceCharge/serviceCharge.controller.js';

const router = express.Router();

router.post('/', createServiceCharge);
router.get('/', getAllServiceCharges);
router.get('/categories', getServiceCategories);
router.patch('/:id', updateServiceCharge);
router.delete('/:id', deleteServiceCharge);
router.get('/count', getServiceChargeCount);
export default router;
