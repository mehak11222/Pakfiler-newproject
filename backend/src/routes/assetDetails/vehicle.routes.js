import express from 'express';
import { createVehicle, getVehicleByUser } from '../../controllers/assetDetails/vehicle.controller.js';

const router = express.Router();
router.post('/vehicle', createVehicle);
router.get('/vehicle', getVehicleByUser);

export default router;
