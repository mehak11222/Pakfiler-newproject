// routes/service.route.js
import express from 'express';
import { getServiceCharges } from '../controllers/service.controller.js';

const router = express.Router();

router.get('/', getServiceCharges); // Public access

export default router;
